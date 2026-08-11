from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.decision import Action

router = APIRouter(prefix="/actions", tags=["actions"])

# security.md #23 default policy: LOW may auto-execute per policy, MEDIUM per
# org policy, HIGH requires human approval, CRITICAL requires explicit
# approval + additional controls. V1 keeps this simple and conservative:
# only LOW-risk actions can skip the approval gate.
RISK_REQUIRES_APPROVAL = {"LOW": False, "MEDIUM": True, "HIGH": True, "CRITICAL": True}


class ActionOut(BaseModel):
    id: str
    title: str
    reason: str
    risk: str
    target_system: str
    impact: str
    status: str
    approval_required: bool

    class Config:
        from_attributes = True


class ActionCreateRequest(BaseModel):
    decision_id: str
    title: str
    reason: str = ""
    risk: str = "LOW"
    target_system: str = ""
    impact: str = ""


class RejectRequest(BaseModel):
    reason: str


@router.get("", response_model=list[ActionOut])
async def list_actions(current_user: AuthenticatedUser = Depends(require_permission("actions:read")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Action))
    return result.scalars().all()


@router.post("", response_model=ActionOut, status_code=status.HTTP_201_CREATED)
async def create_action(
    payload: ActionCreateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("actions:create")),
    db: AsyncSession = Depends(get_db),
):
    if payload.risk not in RISK_REQUIRES_APPROVAL:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid risk level")

    approval_required = RISK_REQUIRES_APPROVAL[payload.risk]
    action = Action(
        decision_id=payload.decision_id, requested_by=current_user.id, title=payload.title,
        reason=payload.reason, risk=payload.risk, target_system=payload.target_system,
        impact=payload.impact, approval_required=approval_required,
        status="AWAITING_APPROVAL" if approval_required else "AVAILABLE",
    )
    db.add(action)
    await db.flush()

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="actions.propose", resource=f"action:{action.id}",
        action=f"Proposed action '{action.title}' (risk={action.risk})",
        severity="HIGH" if payload.risk in ("HIGH", "CRITICAL") else "NEUTRAL",
    )
    await db.commit()
    await db.refresh(action)
    return action


@router.post("/{action_id}/approve", response_model=ActionOut)
async def approve_action(
    action_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("actions:approve")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Action).where(Action.id == action_id))
    action = result.scalar_one_or_none()
    if action is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action not found")
    if action.status != "AWAITING_APPROVAL":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Action is {action.status}, cannot approve")

    action.status = "APPROVED"
    action.approved_by = current_user.id
    action.approved_at = datetime.now(timezone.utc)

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="actions.approve", resource=f"action:{action.id}",
        action=f"Approved action '{action.title}'", severity="HIGH",
    )
    await db.commit()
    await db.refresh(action)
    return action


@router.post("/{action_id}/reject", response_model=ActionOut)
async def reject_action(
    action_id: str,
    payload: RejectRequest,
    current_user: AuthenticatedUser = Depends(require_permission("actions:approve")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Action).where(Action.id == action_id))
    action = result.scalar_one_or_none()
    if action is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action not found")
    if action.status != "AWAITING_APPROVAL":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Action is {action.status}, cannot reject")

    action.status = "REJECTED"
    action.rejection_reason = payload.reason

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="actions.reject", resource=f"action:{action.id}",
        action=f"Rejected action '{action.title}': {payload.reason}", severity="HIGH",
    )
    await db.commit()
    await db.refresh(action)
    return action


@router.post("/{action_id}/execute", response_model=ActionOut)
async def execute_action(
    action_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("actions:execute")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Action).where(Action.id == action_id))
    action = result.scalar_one_or_none()
    if action is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action not found")

    # THE critical security gate (security.md #44): an action that required
    # approval must have been approved — never execute on the strength of an
    # LLM/agent request alone.
    if action.approval_required and action.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Action requires approval before execution (current status: {action.status})",
        )
    if action.status not in ("APPROVED", "AVAILABLE"):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Action is {action.status}, cannot execute")

    action.status = "COMPLETED"
    action.executed_at = datetime.now(timezone.utc)

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="actions.execute", resource=f"action:{action.id}",
        action=f"Executed action '{action.title}' on {action.target_system}", severity="CRITICAL",
    )
    await db.commit()
    await db.refresh(action)
    return action
