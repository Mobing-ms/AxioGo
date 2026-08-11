import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.misc import AuditLog


async def write_audit_log(
    db: AsyncSession,
    *,
    user_id: str | None,
    role: str,
    event: str,
    resource: str,
    action: str,
    severity: str = "NEUTRAL",
    status: str = "SUCCESS",
    metadata: dict | None = None,
) -> None:
    """Append-only audit write. No update/delete path is ever exposed for
    this table anywhere in the API (db_er.md #17)."""
    log = AuditLog(
        user_id=user_id,
        role=role,
        event=event,
        resource=resource,
        action=action,
        severity=severity,
        status=status,
        extra_metadata=json.dumps(metadata or {}),
    )
    db.add(log)
    await db.flush()
