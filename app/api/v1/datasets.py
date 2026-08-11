import json

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import AuthenticatedUser, require_permission
from app.database import get_db
from app.models.dataset import Dataset

router = APIRouter(tags=["datasets"])


class DatasetOut(BaseModel):
    id: str
    name: str
    layer: str
    description: str
    freshness_status: str
    security_classification: str
    row_count: int | None
    schema_fields: list[dict] = []

    class Config:
        from_attributes = True


def _to_out(ds: Dataset) -> DatasetOut:
    try:
        fields = json.loads(ds.schema_reference or "[]")
    except (json.JSONDecodeError, TypeError):
        fields = []
    return DatasetOut(
        id=ds.id, name=ds.name, layer=ds.layer, description=ds.description,
        freshness_status=ds.freshness_status, security_classification=ds.security_classification,
        row_count=ds.row_count, schema_fields=fields,
    )


@router.get("/datasets", response_model=list[DatasetOut])
async def list_datasets(
    search: str | None = Query(default=None),
    layer: str | None = Query(default=None),
    current_user: AuthenticatedUser = Depends(require_permission("datasets:read")),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Dataset)
    if layer:
        stmt = stmt.where(Dataset.layer == layer)
    result = await db.execute(stmt)
    datasets = result.scalars().all()
    if search:
        search_lower = search.lower()
        datasets = [d for d in datasets if search_lower in d.name.lower() or search_lower in d.description.lower()]
    return [_to_out(d) for d in datasets]


@router.get("/datasets/{dataset_id}", response_model=DatasetOut)
async def get_dataset(
    dataset_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("datasets:read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    ds = result.scalar_one_or_none()
    if ds is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    return _to_out(ds)


@router.get("/datasets/{dataset_id}/schema")
async def get_dataset_schema(
    dataset_id: str,
    current_user: AuthenticatedUser = Depends(require_permission("datasets:read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    ds = result.scalar_one_or_none()
    if ds is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    return {"success": True, "data": json.loads(ds.schema_reference or "[]")}


@router.get("/catalog/datasets", response_model=list[DatasetOut])
async def catalog_search(
    search: str | None = Query(default=None),
    current_user: AuthenticatedUser = Depends(require_permission("catalog:read")),
    db: AsyncSession = Depends(get_db),
):
    return await list_datasets(search=search, layer=None, current_user=current_user, db=db)
