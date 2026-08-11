"""
Deterministic SQL validation layer (security.md #13-14).

Generated SQL is always untrusted output. This module is the backend
"SQL Parser / Validator" step in the required flow:

    User Question -> AXIS SQL Agent -> Generated SQL -> SQL Parser/Validator
    -> Dataset Authorization -> Column Authorization -> Read/Write Policy
    -> Query Limits -> Databricks

V1 is read-only: only SELECT statements are allowed, no destructive
keywords, and a row limit is enforced.
"""
import re

from app.config import get_settings

settings = get_settings()

_DESTRUCTIVE_KEYWORDS = (
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE",
    "CREATE", "GRANT", "REVOKE", "MERGE", "REPLACE", "EXEC", "EXECUTE",
)


class SqlValidationError(Exception):
    pass


def validate_sql(sql: str) -> str:
    """Returns the (possibly row-limited) SQL if it passes validation,
    otherwise raises SqlValidationError. Never executes anything itself —
    execution against Databricks happens in a separate, authorized step."""

    if not sql or not sql.strip():
        raise SqlValidationError("Empty SQL is not allowed")

    normalized = sql.strip().rstrip(";")
    upper = normalized.upper()

    if settings.SQL_READ_ONLY and not upper.lstrip().startswith("SELECT"):
        raise SqlValidationError("Only read-only SELECT statements are permitted in V1")

    for keyword in _DESTRUCTIVE_KEYWORDS:
        if re.search(rf"\b{keyword}\b", upper):
            raise SqlValidationError(f"Destructive/unsupported keyword detected: {keyword}")

    if ";" in normalized:
        raise SqlValidationError("Multiple statements are not allowed")

    if "LIMIT" not in upper:
        normalized = f"{normalized} LIMIT {settings.SQL_MAX_ROWS}"

    return normalized
