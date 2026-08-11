"""
Databricks integration boundary (security.md #7): the frontend never talks
to Databricks directly, and credentials never leave the backend.

DEFERRED: real Databricks SQL Warehouse / Jobs API calls. This adapter
exposes the same function signature real code will use, but returns a
clearly-labeled simulated result whenever DATABRICKS_HOST/DATABRICKS_TOKEN
are not configured, so the rest of the pipeline (validation, authorization,
audit) can be built and tested against it now.
"""
from app.config import get_settings

settings = get_settings()


def is_configured() -> bool:
    return bool(settings.DATABRICKS_HOST and settings.DATABRICKS_TOKEN)


async def execute_query(validated_sql: str) -> dict:
    """Execute an already-validated, already-authorized read-only query.

    Callers MUST have already run the SQL through
    `app.services.sql_validator.validate_sql` and confirmed dataset/column
    authorization before calling this.
    """
    if not is_configured():
        return {
            "simulated": True,
            "sql": validated_sql,
            "rows": [],
            "note": "DATABRICKS_HOST/DATABRICKS_TOKEN not configured — returning a simulated empty result.",
        }

    # Real implementation would use the Databricks SQL connector here, e.g.:
    #   from databricks import sql as databricks_sql
    #   with databricks_sql.connect(server_hostname=..., http_path=..., access_token=...) as conn:
    #       ...
    # Intentionally not implemented without real credentials to test against.
    raise NotImplementedError("Real Databricks execution requires a configured SQL warehouse http_path.")
