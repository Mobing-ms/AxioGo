from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.dataset import Dataset

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
async def analytics_overview(
    current_user: AuthenticatedUser = Depends(require_permission("analytics:read")),
    db: AsyncSession = Depends(get_db),
):
    total = await db.execute(select(func.count()).select_from(Dataset))
    gold = await db.execute(select(func.count()).select_from(Dataset).where(Dataset.layer == "GOLD"))
    return {
        "success": True,
        "data": {
            "total_datasets": total.scalar() or 0,
            "gold_layer_datasets": gold.scalar() or 0,
        },
    }
