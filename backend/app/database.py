from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_async_engine(settings.DATABASE_URL, echo=False, connect_args=connect_args)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def init_models() -> None:
    """Create tables. Used for local/dev/test bootstrapping.

    A real deployment against Postgres should use versioned migrations
    (e.g. Alembic) instead of create_all — this is called out explicitly
    in the README as a deferred production concern.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
