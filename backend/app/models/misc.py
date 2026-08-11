from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import UUIDPKMixin, utcnow


class Report(UUIDPKMixin, Base):
    __tablename__ = "reports"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(64), index=True)
    format: Mapped[str] = mapped_column(String(16), index=True)  # PDF / Excel / PowerPoint / Word
    summary: Mapped[str] = mapped_column(Text, default="")
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    source_decision_id: Mapped[str | None] = mapped_column(ForeignKey("decisions.id"), nullable=True, index=True)
    file_reference: Mapped[str | None] = mapped_column(String(500), nullable=True)
    size: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="QUEUED")  # QUEUED/GENERATING/COMPLETE/FAILED
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class Notification(UUIDPKMixin, Base):
    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, default="")
    type: Mapped[str] = mapped_column(String(16), default="INFO")  # INFO/SUCCESS/WARNING/ACTION
    read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class AuditLog(UUIDPKMixin, Base):
    """Append-only. No update/delete endpoint is ever exposed for this table
    (db_er.md #17 'Important rule' / security.md audit requirements)."""

    __tablename__ = "audit_logs"

    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    role: Mapped[str] = mapped_column(String(32), default="")
    event: Mapped[str] = mapped_column(String(128), index=True)
    resource: Mapped[str] = mapped_column(String(255), index=True)
    action: Mapped[str] = mapped_column(Text, default="")
    severity: Mapped[str] = mapped_column(String(16), default="NEUTRAL", index=True)  # NEUTRAL/HIGH/CRITICAL
    status: Mapped[str] = mapped_column(String(16), default="SUCCESS", index=True)
    extra_metadata: Mapped[str] = mapped_column(Text, default="{}")  # JSON-encoded
    timestamp: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class PowerBiConnection(UUIDPKMixin, Base):
    __tablename__ = "powerbi_connections"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    workspace_reference: Mapped[str] = mapped_column(String(255), default="")
    report_reference: Mapped[str] = mapped_column(String(255), index=True, default="")
    dataset_reference: Mapped[str] = mapped_column(String(255), index=True, default="")
    status: Mapped[str] = mapped_column(String(16), default="CONNECTED", index=True)
    last_refresh_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class UserSettings(Base):
    __tablename__ = "settings"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: __import__("uuid").uuid4().hex)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    voice_speed: Mapped[str] = mapped_column(String(16), default="1.0")
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
