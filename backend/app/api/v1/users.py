from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, get_current_user, require_permission
from app.core.security import hash_password
from app.database import get_db
from app.models.user import Role, User
from app.schemas.auth import UserCreateRequest, UserOut, UserUpdateRequest

router = APIRouter(prefix="/users", tags=["users"])


async def _to_user_out(db: AsyncSession, user: User) -> UserOut:
    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    return UserOut(
        id=user.id, name=user.name, email=user.email,
        role=role.name if role else "STANDARD_USER", status=user.status, avatar=user.avatar,
    )


@router.get("", response_model=list[UserOut])
async def list_users(
    current_user: AuthenticatedUser = Depends(require_permission("users:read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [await _to_user_out(db, u) for u in users]


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("users:manage")),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    role_result = await db.execute(select(Role).where(Role.name == payload.role))
    role = role_result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown role")

    user = User(name=payload.name, email=payload.email, hashed_password=hash_password(payload.password), role_id=role.id)
    db.add(user)
    await db.flush()

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="users.create", resource=f"user:{user.id}",
        action=f"Created user {user.email} with role {role.name}", severity="HIGH",
    )
    await db.commit()
    return await _to_user_out(db, user)


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: AuthenticatedUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one()
    return await _to_user_out(db, user)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("users:read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await _to_user_out(db, user)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str,
    payload: UserUpdateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("users:manage")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.name:
        user.name = payload.name
    if payload.status:
        user.status = payload.status
    if payload.role:
        role_result = await db.execute(select(Role).where(Role.name == payload.role))
        role = role_result.scalar_one_or_none()
        if role is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown role")
        user.role_id = role.id

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="users.update", resource=f"user:{user.id}",
        action=f"Updated user {user.email}: {payload.model_dump(exclude_none=True)}", severity="HIGH",
    )
    await db.commit()
    return await _to_user_out(db, user)


@router.delete("/{user_id}")
async def deactivate_user(
    user_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("users:manage")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.status = "INACTIVE"
    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="users.deactivate", resource=f"user:{user.id}",
        action=f"Deactivated user {user.email}", severity="HIGH",
    )
    await db.commit()
    return {"success": True, "data": {"message": "User deactivated"}}
