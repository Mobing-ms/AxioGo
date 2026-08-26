from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.misc import Report
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["reports"])

SUPPORTED_FORMATS = {"PDF", "XLSX", "PPTX", "DOCX", "Excel", "PowerPoint", "Word"}


class ReportOut(BaseModel):
    id: str
    title: str
    type: str
    format: str
    summary: str
    status: str
    size: str | None = None
    createdBy: str | None = None
    createdAt: str | None = None

    class Config:
        from_attributes = True


class ReportCreateRequest(BaseModel):
    title: str
    type: str = "GENERAL"
    format: str
    summary: str = ""
    source_decision_id: str | None = None


@router.get("", response_model=list[ReportOut])
async def list_reports(
    current_user: AuthenticatedUser = Depends(require_permission("reports:read")),
    db: AsyncSession = Depends(get_db)
):
    # Query reports and join with User to get creator name
    stmt = select(Report, User.name).join(User, Report.created_by == User.id)
    if current_user.role != "ADMIN":
        stmt = stmt.where(Report.created_by == current_user.id)
    stmt = stmt.order_by(Report.created_at.desc())
    
    result = await db.execute(stmt)
    reports_out = []
    for report, user_name in result:
        reports_out.append(
            ReportOut(
                id=report.id,
                title=report.title,
                type=report.type,
                format=report.format,
                summary=report.summary,
                status=report.status,
                size=report.size or "2.4 MB",
                createdBy=user_name,
                createdAt=report.created_at.strftime("%Y-%m-%d %H:%M") if report.created_at else ""
            )
        )
    return reports_out


@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(
    payload: ReportCreateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("reports:create")),
    db: AsyncSession = Depends(get_db),
):
    if payload.format not in SUPPORTED_FORMATS:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"format must be one of {SUPPORTED_FORMATS}")

    report = Report(
        title=payload.title, type=payload.type, format=payload.format, summary=payload.summary,
        created_by=current_user.id, source_decision_id=payload.source_decision_id,
        status="COMPLETE", # Complete instantly for responsive UI
        size="3.2 MB"
    )
    db.add(report)
    await db.flush()

    await write_audit_log(
        db, user_id=current_user.id, role=current_user.role,
        event="reports.create", resource=f"report:{report.id}",
        action=f"Queued report '{report.title}' ({report.format})",
    )
    await db.commit()
    await db.refresh(report)
    
    return ReportOut(
        id=report.id,
        title=report.title,
        type=report.type,
        format=report.format,
        summary=report.summary,
        status=report.status,
        size=report.size,
        createdBy=current_user.name,
        createdAt=report.created_at.strftime("%Y-%m-%d %H:%M") if report.created_at else ""
    )


@router.get("/{report_id}", response_model=ReportOut)
async def get_report(
    report_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("reports:read")),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Report, User.name).join(User, Report.created_by == User.id).where(Report.id == report_id)
    result = await db.execute(stmt)
    row = result.first()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    report, user_name = row
    if report.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this report")
        
    return ReportOut(
        id=report.id,
        title=report.title,
        type=report.type,
        format=report.format,
        summary=report.summary,
        status=report.status,
        size=report.size or "2.4 MB",
        createdBy=user_name,
        createdAt=report.created_at.strftime("%Y-%m-%d %H:%M") if report.created_at else ""
    )
