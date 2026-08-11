from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, UUIDPKMixin


class DataSource(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "data_sources"
    __table_args__ = (UniqueConstraint("name", name="uq_data_sources_name"),)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(32), index=True)  # DATABRICKS / SQL / STREAM / FILE / OTHER
    # Reference into a secrets manager — never the raw credential (security.md #5).
    connection_reference: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(16), default="CONNECTED", index=True)
    last_sync_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Dataset(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "datasets"
    __table_args__ = (UniqueConstraint("source_id", "name", name="uq_dataset_source_name"),)

    source_id: Mapped[str] = mapped_column(ForeignKey("data_sources.id"), nullable=False)
    workspace_id: Mapped[str | None] = mapped_column(ForeignKey("workspaces.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    layer: Mapped[str] = mapped_column(String(16), index=True)  # RAW / BRONZE / SILVER / GOLD
    description: Mapped[str] = mapped_column(Text, default="")
    schema_reference: Mapped[str] = mapped_column(Text, default="[]")  # JSON-encoded field metadata
    freshness_status: Mapped[str] = mapped_column(String(16), default="UNKNOWN", index=True)
    last_synced_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    security_classification: Mapped[str] = mapped_column(String(64), default="INTERNAL")
    row_count: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
