from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin


class Decision(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "decisions"

    query_id: Mapped[str] = mapped_column(ForeignKey("axis_queries.id"), nullable=False, index=True)
    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendation: Mapped[str] = mapped_column(Text, default="")
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="GENERATED", index=True)


class Action(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "actions"

    decision_id: Mapped[str] = mapped_column(ForeignKey("decisions.id"), nullable=False, index=True)
    requested_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str] = mapped_column(Text, default="")
    risk: Mapped[str] = mapped_column(String(16), index=True)  # LOW / MEDIUM / HIGH / CRITICAL
    target_system: Mapped[str] = mapped_column(String(255), default="")
    impact: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(32), default="AVAILABLE", index=True)
    approval_required: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    approved_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    executed_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
