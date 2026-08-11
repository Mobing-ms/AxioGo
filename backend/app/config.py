"""
Central application configuration.

All values are read from environment variables (see .env.example).
Nothing sensitive is hardcoded here.

Supabase credentials are optional during local development/testing.
Production deployments should provide all required secrets through
environment variables or a secrets manager.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- General ---
    APP_NAME: str = "AxioGo API"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    # SQLite remains the local/dev default for now.
    # We will migrate this to Supabase PostgreSQL in a later phase.
    DATABASE_URL: str = "sqlite+aiosqlite:///./axiogo_dev.db"

    # --- Auth / JWT ---
    # Current custom JWT configuration.
    # This will be replaced/updated when Supabase Auth becomes
    # the primary authentication mechanism.
    JWT_SECRET: str = "INSECURE-DEV-SECRET-CHANGE-ME"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- CORS ---
    # Comma-separated list of allowed frontend origins.
    CORS_ORIGINS: str = (
        "http://localhost:5173,http://localhost:4173"
    )

    # --- LLM (Gemini via LangChain) ---
    # AXIS falls back to a deterministic stub when no key is configured.
    GOOGLE_API_KEY: str | None = None
    AXIS_MODEL_NAME: str = "gemini-2.0-flash"

    # --- Supabase ---
    # Supabase Auth / API configuration.
    # These are loaded from backend/.env during local development.
    SUPABASE_URL: str | None = None
    SUPABASE_PUBLISHABLE_KEY: str | None = None
    SUPABASE_SECRET_KEY: str | None = None

    # --- Databricks ---
    # Stub adapter until real credentials are supplied.
    DATABRICKS_HOST: str | None = None
    DATABRICKS_TOKEN: str | None = None

    # --- SQL execution guardrails ---
    SQL_READ_ONLY: bool = True
    SQL_MAX_ROWS: int = 1000

    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS origins as a cleaned list."""
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    """Return the cached application settings."""
    return Settings()