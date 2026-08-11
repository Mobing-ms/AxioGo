"""
Reusable authentication/authorization dependencies.

security.md #5: "Frontend Authorization Is Not Security". Every protected
route in this API depends on `get_current_user` (or `require_permission` /
`require_role`) so authorization is enforced here, independent of anything
the frontend does or doesn't hide in the UI.
"""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import TokenError, decode_token
from app.database import get_db
from app.models.user import Role, User, UserStatus, permissions_for_role

_bearer_scheme = HTTPBearer(auto_error=False)


class AuthenticatedUser:
    """Lightweight view of the authenticated identity + resolved permissions,
    matching the shape required by security.md #3 (user_id, name, email,
    role, permissions)."""

    def __init__(self, user: User, role_name: str):
        self.id = user.id
        self.name = user.name
        self.email = user.email
        self.status = user.status
        self.role = role_name
        self.permissions = set(permissions_for_role(role_name))

    def has_permission(self, permission: str) -> bool:
        return permission in self.permissions


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> AuthenticatedUser:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(credentials.credentials, expected_type="access")
    except TokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None or user.status != UserStatus.ACTIVE.value:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive or not found")

    role_result = await db.execute(select(Role).where(Role.id == user.role_id))
    role = role_result.scalar_one_or_none()
    role_name = role.name if role else "STANDARD_USER"

    # Attach for audit middleware / logging without a second DB round-trip.
    request.state.current_user_id = user.id
    request.state.current_user_role = role_name

    return AuthenticatedUser(user, role_name)


def require_permission(permission: str):
    """Dependency factory: `Depends(require_permission("actions:approve"))`."""

    async def _check(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if not current_user.has_permission(permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission}",
            )
        return current_user

    return _check


def require_role(*allowed_roles: str):
    """Dependency factory: `Depends(require_role('ADMIN'))`."""

    async def _check(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of roles: {', '.join(allowed_roles)}",
            )
        return current_user

    return _check
