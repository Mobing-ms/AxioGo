"""
Databricks integration boundary (security.md #7): the frontend never talks
to Databricks directly, and credentials never leave the backend.

If DATABRICKS_HOST, DATABRICKS_TOKEN, and DATABRICKS_HTTP_PATH are configured,
queries are executed against the real Databricks SQL Warehouse.
Otherwise, they fall back to a local self-seeded SQLite database replica of the Gold Layer.
"""
import os
import re
import sqlite3
from app.config import get_settings
from app.services.databricks_seeder import seed_sqlite_lakehouse

settings = get_settings()


def is_configured() -> bool:
    return bool(settings.DATABRICKS_HOST and settings.DATABRICKS_TOKEN and settings.DATABRICKS_HTTP_PATH)


async def execute_query(validated_sql: str) -> dict:
    """Execute an already-validated, already-authorized read-only query.

    Callers MUST have already run the SQL through
    `app.services.sql_validator.validate_sql` and confirmed dataset/column
    authorization before calling this.
    """
    if is_configured():
        import anyio

        def _run_databricks_query():
            from databricks import sql as databricks_sql
            with databricks_sql.connect(
                server_hostname=settings.DATABRICKS_HOST,
                http_path=settings.DATABRICKS_HTTP_PATH,
                access_token=settings.DATABRICKS_TOKEN,
            ) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(validated_sql)
                    columns = [desc[0] for desc in cursor.description]
                    rows = cursor.fetchall()
                    return [dict(zip(columns, row)) for row in rows]

        try:
            results = await anyio.to_thread.run_sync(_run_databricks_query)
            return {
                "simulated": False,
                "sql": validated_sql,
                "rows": results,
            }
        except Exception as e:
            raise RuntimeError(f"Databricks query execution failed: {str(e)}")

    else:
        import anyio

        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        db_path = os.path.join(backend_dir, "axiogo_lakehouse.db")

        # Self-seed if database file does not exist
        if not os.path.exists(db_path):
            seed_sqlite_lakehouse(db_path)

        def _run_sqlite_query():
            # Translate table names from catalog.schema.table structure to table structure for SQLite
            translated_sql = validated_sql
            # Strip three-level names like workspace.insight.dim_vehicle -> dim_vehicle
            translated_sql = re.sub(r'\b(?:workspace\.)?insight\.(\w+)\b', r'\1', translated_sql)
            translated_sql = re.sub(r'\b(?:workspace\.)?forge\.(\w+)\b', r'\1', translated_sql)

            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            try:
                cursor = conn.cursor()
                cursor.execute(translated_sql)
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
            finally:
                conn.close()

        results = await anyio.to_thread.run_sync(_run_sqlite_query)
        return {
            "simulated": True,
            "sql": validated_sql,
            "rows": results,
            "note": "DATABRICKS_HOST/DATABRICKS_TOKEN not configured — returning local SQLite result.",
        }
