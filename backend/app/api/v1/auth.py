from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, get_current_user
from app.core.security import (
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.database import get_db
from app.models.user import Role, User, UserStatus, permissions_for_role
from app.schemas.auth import CurrentUserResponse, LoginRequest, RefreshRequest, TokenPair

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    # Constant-shape failure: don't reveal whether the email exists.
    if user is None or not verify_password(payload.password, user.hashed_password):
        await write_audit_log(
            db,
            user_id=None,
            role="",
            event="auth.login_failed",
            resource="auth",
            action=f"Failed login attempt for {payload.email}",
            severity="HIGH",
            status="FAILED",
        )
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if user.status != UserStatus.ACTIVE.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    role_name = role.name if role else "STANDARD_USER"

    access_token = create_access_token(user.id, role_name)
    refresh_token = create_refresh_token(user.id)

    await write_audit_log(
        db,
        user_id=user.id,
        role=role_name,
        event="auth.login_success",
        resource="auth",
        action=f"User {user.email} logged in",
    )
    await db.commit()

    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    try:
        decoded = decode_token(payload.refresh_token, expected_type="refresh")
    except TokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    user_id = decoded.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or user.status != UserStatus.ACTIVE.value:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive or not found")

    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    role_name = role.name if role else "STANDARD_USER"

    return TokenPair(
        access_token=create_access_token(user.id, role_name),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout")
async def logout(current_user: AuthenticatedUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # V1 uses stateless short-lived JWTs (no server-side session store), so
    # logout is a client-side token discard; we still audit the intent.
    # A denylist/refresh-token revocation table is a documented V2 addition.
    await write_audit_log(
        db,
        user_id=current_user.id,
        role=current_user.role,
        event="auth.logout",
        resource="auth",
        action=f"User {current_user.email} logged out",
    )
    await db.commit()
    return {"success": True, "data": {"message": "Logged out"}}


@router.get("/me", response_model=CurrentUserResponse)
async def me(current_user: AuthenticatedUser = Depends(get_current_user)) -> CurrentUserResponse:
    return CurrentUserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        permissions=sorted(current_user.permissions),
    )
