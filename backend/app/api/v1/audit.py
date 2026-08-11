import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.misc import AuditLog

router = APIRouter(prefix="/audit", tags=["audit"])


class AuditLogOut(BaseModel):
    id: str
    user_id: str | None
    role: str
    event: str
    resource: str
    action: str
    severity: str
    status: str
    metadata: dict


@router.get("", response_model=list[AuditLogOut])
async def list_audit_logs(
    current_user: AuthenticatedUser = Depends(require_permission("audit:read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(200))
    logs = result.scalars().all()
    return [
        AuditLogOut(
            id=log.id, user_id=log.user_id, role=log.role, event=log.event,
            resource=log.resource, action=log.action, severity=log.severity,
            status=log.status, metadata=json.loads(log.extra_metadata or "{}"),
        )
        for log in logs
    ]
