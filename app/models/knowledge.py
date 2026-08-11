from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin


class BusinessContext(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "business_context"
    __table_args__ = (
        UniqueConstraint("workspace_id", "name", "version", name="uq_context_ws_name_version"),
    )

    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(16), index=True)  # KPI / RULE / SOP / POLICY / DEFINITION / OTHER
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source_reference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    version: Mapped[str] = mapped_column(String(32), default="1.0")
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE", index=True)
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)


class KnowledgeDocument(UUIDPKMixin, TimestampMixin, Base):
    """RAG-eligible unstructured enterprise knowledge (security.md #9-10).

    `allowed_roles` is a comma-separated role list used by the RAG retrieval
    filter to keep unauthorized documents out of the LLM context entirely
    (never filtered after the fact).
    """

    __tablename__ = "knowledge_documents"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(16), index=True)  # SOP / POLICY / MANUAL / GUIDELINE / REPORT / OTHER
    source_uri: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE", index=True)
    classification: Mapped[str] = mapped_column(String(32), default="INTERNAL")
    allowed_roles: Mapped[str] = mapped_column(String(255), default="ADMIN,AUTHORIZED_USER,STANDARD_USER")
    indexed_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
