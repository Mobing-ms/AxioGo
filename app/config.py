"""
Central application configuration.

All values are read from environment variables (see .env.example).
Nothing sensitive is hardcoded here. If a required secret is missing,
the setting falls back to an obviously-fake local-dev default so the
app can still run for local development / tests, but production
deployments MUST override every one of these via real environment
variables or a secrets manager.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- General ---
    APP_NAME: str = "AxioGo API"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    # Postgres-compatible design (db_er.md). SQLite is used as the local/dev
    # default so the project runs without external infrastructure; point
    # DATABASE_URL at Postgres in staging/production.
    DATABASE_URL: str = "sqlite+aiosqlite:///./axiogo_dev.db"

    # --- Auth / JWT ---
    JWT_SECRET: str = "INSECURE-DEV-SECRET-CHANGE-ME"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- CORS ---
    # Comma-separated list of allowed frontend origins.
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    # --- LLM (Gemini via LangChain) ---
    # AXIS falls back to a deterministic stub agent pipeline when no key is
    # configured, so the API and tests run without network/API access.
    GOOGLE_API_KEY: str | None = None
    AXIS_MODEL_NAME: str = "gemini-2.0-flash"

    # --- Databricks (stub adapter until real credentials are supplied) ---
    DATABRICKS_HOST: str | None = None
    DATABRICKS_TOKEN: str | None = None

    # --- SQL execution guardrails ---
    SQL_READ_ONLY: bool = True
    SQL_MAX_ROWS: int = 1000

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
