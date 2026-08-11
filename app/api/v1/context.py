from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.knowledge import BusinessContext

router = APIRouter(prefix="/context", tags=["business-context"])


class BusinessContextOut(BaseModel):
    id: str
    type: str
    name: str
    content: str
    version: str
    status: str

    class Config:
        from_attributes = True


@router.get("/kpis", response_model=list[BusinessContextOut])
async def list_kpis(current_user: AuthenticatedUser = Depends(require_permission("business_context:read")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusinessContext).where(BusinessContext.type == "KPI", BusinessContext.status == "ACTIVE"))
    return result.scalars().all()


@router.get("/business-rules", response_model=list[BusinessContextOut])
async def list_business_rules(current_user: AuthenticatedUser = Depends(require_permission("business_context:read")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusinessContext).where(BusinessContext.type == "RULE", BusinessContext.status == "ACTIVE"))
    return result.scalars().all()


@router.get("/search", response_model=list[BusinessContextOut])
async def search_context(q: str = "", current_user: AuthenticatedUser = Depends(require_permission("business_context:read")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusinessContext).where(BusinessContext.status == "ACTIVE"))
    items = result.scalars().all()
    if q:
        q_lower = q.lower()
        items = [i for i in items if q_lower in i.name.lower() or q_lower in i.content.lower()]
    return items
