from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin, new_uuid, utcnow


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class AuthProviderType(str, Enum):
    LOCAL = "LOCAL"
    GOOGLE = "GOOGLE"


class RoleName(str, Enum):
    """Exactly three enterprise roles, per api.md / security.md."""

    ADMIN = "ADMIN"
    AUTHORIZED_USER = "AUTHORIZED_USER"
    STANDARD_USER = "STANDARD_USER"


class Role(UUIDPKMixin, Base):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    users: Mapped[list["User"]] = relationship(back_populates="role")


class User(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"), nullable=False, index=True)
    auth_provider: Mapped[str] = mapped_column(String(32), default=AuthProviderType.LOCAL.value, nullable=False)
    avatar: Mapped[str | None] = mapped_column(String(16), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default=UserStatus.ACTIVE.value, index=True)
    last_active_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    role: Mapped["Role"] = relationship(back_populates="users")


# --- Permission matrix (backend-enforced; frontend hiding is UX only) ---
# api.md section 4 lists the permission strings. We express them as a static
# role -> permission-set mapping rather than a separate DB-driven ACL system,
# since V1 only has three fixed roles (future.md: fine-grained ABAC is
# explicitly deferred).
ROLE_PERMISSIONS: dict[str, set[str]] = {
    RoleName.ADMIN.value: {
        "users:read", "users:manage",
        "workspaces:read", "workspaces:create", "workspaces:update", "workspaces:delete",
        "datasets:read", "datasets:upload", "datasets:update", "datasets:delete",
        "catalog:read", "business_context:read", "knowledge:read",
        "analytics:read", "axis:use", "axis:technical",
        "reports:read", "reports:create", "reports:download",
        "actions:read", "actions:create", "actions:approve", "actions:execute",
        "databricks:read", "databricks:execute",
        "powerbi:read", "powerbi:refresh",
        "monitoring:read", "audit:read",
        "settings:read", "settings:manage",
    },
    RoleName.AUTHORIZED_USER.value: {
        "workspaces:read",
        "datasets:read",
        "catalog:read", "business_context:read", "knowledge:read",
        "analytics:read", "axis:use",
        "reports:read", "reports:create", "reports:download",
        "actions:read", "actions:create",
        "powerbi:read", "powerbi:refresh",
        "settings:read",
    },
    RoleName.STANDARD_USER.value: {
        "workspaces:read",
        "datasets:read",
        "catalog:read", "business_context:read",
        "analytics:read", "axis:use",
        "reports:read",
        "actions:read",
        "powerbi:read",
        "settings:read",
    },
}


def permissions_for_role(role_name: str) -> list[str]:
    return sorted(ROLE_PERMISSIONS.get(role_name, set()))
