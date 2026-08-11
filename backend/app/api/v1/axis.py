from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.axis import AxisQuery, AxisSession
from app.models.decision import Decision

from axis.graph import run_axis_query

router = APIRouter(prefix="/axis", tags=["axis"])


class SessionCreateRequest(BaseModel):
    workspace_id: str


class SessionOut(BaseModel):
    id: str
    workspace_id: str
    status: str

    class Config:
        from_attributes = True


class MessageRequest(BaseModel):
    message: str
    dataset_id: str | None = None


class MessageResponse(BaseModel):
    message_id: str
    status: str
    answer: str
    recommendations: list[str]
    trace: list[dict]
    decision_id: str | None = None


@router.post("/sessions", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(
    payload: SessionCreateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("axis:use")),
    db: AsyncSession = Depends(get_db),
):
    session = AxisSession(
        user_id=current_user.id, workspace_id=payload.workspace_id,
        started_at=datetime.now(timezone.utc), status="ACTIVE",
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions", response_model=list[SessionOut])
async def list_sessions(current_user: AuthenticatedUser = Depends(require_permission("axis:use")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AxisSession).where(AxisSession.user_id == current_user.id))
    return result.scalars().all()


@router.post("/sessions/{session_id}/messages", response_model=MessageResponse)
async def send_message(
    session_id: str,
    payload: MessageRequest,
    current_user: AuthenticatedUser = Depends(require_permission("axis:use")),
    db: AsyncSession = Depends(get_db),
):
    session_result = await db.execute(select(AxisSession).where(AxisSession.id == session_id))
    session = session_result.scalar_one_or_none()
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AXIS session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your session")

    query_row = AxisQuery(
        session_id=session_id, user_id=current_user.id, query_text=payload.message,
        input_type="TEXT", status="PROCESSING", created_at=datetime.now(timezone.utc),
    )
    db.add(query_row)
    await db.flush()

    # Authorization context propagates INTO the graph — every agent runs
    # with the requesting user's role/permissions, never elevated
    # (security.md #36-37).
    final_state = await run_axis_query(
        db,
        query=payload.message,
        user_id=current_user.id,
        role=current_user.role,
        permissions=sorted(current_user.permissions),
        workspace_id=session.workspace_id,
        dataset_id=payload.dataset_id,
    )

    query_row.status = "COMPLETED"
    query_row.completed_at = datetime.now(timezone.utc)

    decision = Decision(
        query_id=query_row.id,
        workspace_id=session.workspace_id,
        title=payload.message[:120],
        summary=final_state.get("answer", ""),
        recommendation="; ".join(final_state.get("recommendations", [])),
        status="GENERATED",
    )
    db.add(decision)
    await db.flush()

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="axis.query", resource=f"axis_query:{query_row.id}",
        action=f"AXIS query in session {session_id}: {payload.message[:200]}",
    )
    await db.commit()

    return MessageResponse(
        message_id=query_row.id,
        status="COMPLETE",
        answer=final_state.get("answer", ""),
        recommendations=final_state.get("recommendations", []),
        trace=final_state.get("trace", []),
        decision_id=decision.id,
    )
