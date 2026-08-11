import asyncio

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import hash_password
from app.database import Base, get_db
from app.main import app
from app.models.user import Role, RoleName, User
from app.models.workspace import Workspace

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest_asyncio.fixture
async def seeded_users(db_session: AsyncSession):
    roles = {}
    for name in (RoleName.ADMIN.value, RoleName.AUTHORIZED_USER.value, RoleName.STANDARD_USER.value):
        role = Role(name=name, description=name)
        db_session.add(role)
        await db_session.flush()
        roles[name] = role

    workspace = Workspace(name="Test Workspace", description="")
    db_session.add(workspace)
    await db_session.flush()

    users = {
        "admin": User(name="Admin", email="admin@test.dev", hashed_password=hash_password("adminpass123"), role_id=roles["ADMIN"].id),
        "authorized": User(name="Authorized", email="authorized@test.dev", hashed_password=hash_password("authpass123"), role_id=roles["AUTHORIZED_USER"].id),
        "standard": User(name="Standard", email="standard@test.dev", hashed_password=hash_password("stdpass123"), role_id=roles["STANDARD_USER"].id),
    }
    for u in users.values():
        db_session.add(u)
    await db_session.commit()

    return {"roles": roles, "workspace": workspace, "users": users}


@pytest_asyncio.fixture
async def client(db_session: AsyncSession, seeded_users):
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test/api/v1") as ac:
        yield ac
    app.dependency_overrides.clear()
