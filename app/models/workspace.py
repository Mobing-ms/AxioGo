from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin, new_uuid, utcnow
from sqlalchemy import DateTime


class Workspace(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE", index=True)


class UserWorkspace(Base):
    __tablename__ = "user_workspaces"
    __table_args__ = (UniqueConstraint("user_id", "workspace_id", name="uq_user_workspace"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True, index=True)
    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), primary_key=True, index=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow)
