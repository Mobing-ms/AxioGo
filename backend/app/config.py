"""
Central application configuration.

All values are read from environment variables (see .env.example).
Nothing sensitive is hardcoded here.

Supabase credentials are optional during local development/testing.
Production deployments should provide all required secrets through
environment variables or a secrets manager.
"""

from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# This value is deliberately limited to local development and tests. A
# deployed instance must always receive a unique secret through its runtime
# environment or secrets manager.
LOCAL_DEVELOPMENT_JWT_SECRET = "axiogo-local-development-secret-not-for-production"


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
    JWT_SECRET: str = ""
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

    @model_validator(mode="after")
    def require_a_valid_jwt_secret(self) -> "Settings":
        """Use a usable local key, but never allow an empty production key.

        An empty ``JWT_SECRET=`` in ``.env`` overrides Pydantic's field
        default. That previously let the application start successfully and
        then crash on every successful login when PyJWT tried to sign a token.
        """
        if self.JWT_SECRET.strip():
            return self

        local_environments = {"development", "dev", "local", "test", "testing"}
        if self.ENVIRONMENT.strip().lower() in local_environments:
            self.JWT_SECRET = LOCAL_DEVELOPMENT_JWT_SECRET
            return self

        raise ValueError(
            "JWT_SECRET must be set to a strong, unique value outside local development."
        )

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