from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin, new_uuid


class AxisAgent(Base):
    __tablename__ = "axis_agents"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True))


class AxisSession(UUIDPKMixin, Base):
    __tablename__ = "axis_sessions"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False, index=True)
    started_at: Mapped[object] = mapped_column(DateTime(timezone=True), index=True)
    ended_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE", index=True)


class AxisQuery(UUIDPKMixin, Base):
    __tablename__ = "axis_queries"

    session_id: Mapped[str] = mapped_column(ForeignKey("axis_sessions.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    input_type: Mapped[str] = mapped_column(String(8), default="TEXT")  # TEXT / VOICE
    status: Mapped[str] = mapped_column(String(16), default="PROCESSING", index=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), index=True)
    completed_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AxisAgentRun(UUIDPKMixin, Base):
    __tablename__ = "axis_agent_runs"
    __table_args__ = (UniqueConstraint("query_id", "agent_id", name="uq_query_agent"),)

    query_id: Mapped[str] = mapped_column(ForeignKey("axis_queries.id"), nullable=False, index=True)
    agent_id: Mapped[str] = mapped_column(ForeignKey("axis_agents.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(16), default="STARTED")
    input_reference: Mapped[str | None] = mapped_column(Text, nullable=True)
    output_reference: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[object] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
