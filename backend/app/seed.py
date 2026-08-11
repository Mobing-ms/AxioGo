"""
Seeds a minimal but coherent dataset so the API is immediately usable for
local development and the end-to-end acceptance test:

    ADMIN            admin@axiogo.dev            admin12345
    AUTHORIZED_USER  authorized@axiogo.dev        authorized12345
    STANDARD_USER    standard@axiogo.dev          standard12345

Run with: uv run python -m app.seed
"""
import asyncio
import json
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.database import AsyncSessionLocal, init_models
from app.models.axis import AxisAgent
from app.models.dataset import DataSource, Dataset
from app.models.knowledge import BusinessContext
from app.models.user import Role, RoleName, User
from app.models.workspace import UserWorkspace, Workspace

DEMO_USERS = [
    ("Alex Vance", "admin@axiogo.dev", "admin12345", RoleName.ADMIN.value),
    ("Jordan Reyes", "authorized@axiogo.dev", "authorized12345", RoleName.AUTHORIZED_USER.value),
    ("Sam Patel", "standard@axiogo.dev", "standard12345", RoleName.STANDARD_USER.value),
]

AXIS_AGENTS = [
    ("agent_coord", "Coordinator Agent", "Routes user query, orchestrates agent pipeline, enforces security"),
    ("agent_know", "Knowledge / Metadata Agent", "Retrieves business definitions, RAG docs, schema metadata"),
    ("agent_code", "Code Agent", "Generates secure SQL for the Databricks Lakehouse"),
    ("agent_analytic", "Analytics & Insight Agent", "Executes analysis, anomaly detection, root cause identification"),
    ("agent_report", "Report Agent", "Synthesizes analytical outputs into structured reports"),
    ("agent_flow", "Workflow Agent", "Proposes controlled autonomous actions"),
]


async def seed() -> None:
    await init_models()

    async with AsyncSessionLocal() as db:
        # Roles
        role_map = {}
        for role_name in (RoleName.ADMIN.value, RoleName.AUTHORIZED_USER.value, RoleName.STANDARD_USER.value):
            existing = await db.execute(select(Role).where(Role.name == role_name))
            role = existing.scalar_one_or_none()
            if role is None:
                role = Role(name=role_name, description=f"{role_name} role", created_at=datetime.now(timezone.utc))
                db.add(role)
                await db.flush()
            role_map[role_name] = role

        # Demo users
        for name, email, password, role_name in DEMO_USERS:
            existing = await db.execute(select(User).where(User.email == email))
            if existing.scalar_one_or_none() is None:
                db.add(User(
                    name=name, email=email, hashed_password=hash_password(password),
                    role_id=role_map[role_name].id,
                    avatar="".join(part[0] for part in name.split()[:2]).upper(),
                ))

        # Workspace
        ws_result = await db.execute(select(Workspace).where(Workspace.name == "Global Operations"))
        workspace = ws_result.scalar_one_or_none()
        if workspace is None:
            workspace = Workspace(name="Global Operations", description="Primary automotive fleet workspace")
            db.add(workspace)
            await db.flush()

        # AXIS agents
        for agent_id, name, role_desc in AXIS_AGENTS:
            existing = await db.execute(select(AxisAgent).where(AxisAgent.id == agent_id))
            if existing.scalar_one_or_none() is None:
                db.add(AxisAgent(id=agent_id, name=name, role=role_desc, status="ACTIVE", created_at=datetime.now(timezone.utc)))

        # Data source + a couple of sample datasets (mirrors the frontend's
        # existing mock catalog so the API and current UI describe the same
        # world once wired together)
        src_result = await db.execute(select(DataSource).where(DataSource.name == "Databricks Lakehouse"))
        source = src_result.scalar_one_or_none()
        if source is None:
            source = DataSource(
                name="Databricks Lakehouse", type="DATABRICKS",
                connection_reference="secrets://databricks/primary", status="CONNECTED",
            )
            db.add(source)
            await db.flush()

        sample_datasets = [
            ("Vehicle Telemetry", "GOLD", "High-frequency telemetry from IoT edge modules on active fleet vehicles.",
             [{"name": "vehicle_id", "type": "STRING"}, {"name": "engine_temp_c", "type": "DOUBLE"}], 1_400_000_000),
            ("Maintenance Records", "GOLD", "Historical and active shop work orders, parts consumption, mechanic hours.",
             [{"name": "work_order_id", "type": "STRING"}, {"name": "cost_usd", "type": "DECIMAL"}], 2_100_000),
        ]
        for name, layer, desc, fields, rows in sample_datasets:
            existing = await db.execute(select(Dataset).where(Dataset.name == name))
            if existing.scalar_one_or_none() is None:
                db.add(Dataset(
                    source_id=source.id, workspace_id=workspace.id, name=name, layer=layer,
                    description=desc, schema_reference=json.dumps(fields),
                    freshness_status="CURRENT", row_count=rows,
                ))

        # A KPI business-context entry so AXIS has something authorized to retrieve
        bc_result = await db.execute(select(BusinessContext).where(BusinessContext.name == "Fleet Maintenance Cost"))
        if bc_result.scalar_one_or_none() is None:
            admin_user = await db.execute(select(User).where(User.email == "admin@axiogo.dev"))
            admin = admin_user.scalar_one()
            db.add(BusinessContext(
                workspace_id=workspace.id, type="KPI", name="Fleet Maintenance Cost",
                content="Total service and parts cost per vehicle group, tracked monthly against a 5% MoM growth threshold.",
                version="1.0", status="ACTIVE", created_by=admin.id,
            ))

        await db.commit()

    print("Seed complete.")
    print("  ADMIN            admin@axiogo.dev / admin12345")
    print("  AUTHORIZED_USER  authorized@axiogo.dev / authorized12345")
    print("  STANDARD_USER    standard@axiogo.dev / standard12345")


if __name__ == "__main__":
    asyncio.run(seed())
