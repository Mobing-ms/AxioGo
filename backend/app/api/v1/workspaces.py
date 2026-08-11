from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import AuthenticatedUser, get_current_user, require_permission
from app.database import get_db
from app.models.workspace import Workspace

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


class WorkspaceOut(BaseModel):
    id: str
    name: str
    description: str
    status: str

    class Config:
        from_attributes = True


class WorkspaceCreateRequest(BaseModel):
    name: str
    description: str = ""


@router.get("", response_model=list[WorkspaceOut])
async def list_workspaces(current_user: AuthenticatedUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.status == "ACTIVE"))
    return result.scalars().all()


@router.post("", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    payload: WorkspaceCreateRequest,
    current_user: AuthenticatedUser = Depends(require_permission("workspaces:create")),
    db: AsyncSession = Depends(get_db),
):
    workspace = Workspace(name=payload.name, description=payload.description)
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceOut)
async def get_workspace(workspace_id: str, current_user: AuthenticatedUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    workspace = result.scalar_one_or_none()
    if workspace is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return workspace
