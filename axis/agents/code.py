"""
3. Code Agent

Generates SQL for the Databricks Lakehouse. The generated SQL is always
treated as untrusted output (security.md #13): it is run through the
deterministic validator before it is ever considered for execution. This
agent NEVER executes SQL itself.
"""
from app.services.sql_validator import SqlValidationError, validate_sql
from axis.llm import get_llm
from axis.state import AxisState

_SIMPLE_TEMPLATE = (
    'SELECT * FROM gold_datasets WHERE description LIKE "%{keyword}%"'
)


def code_node(state: AxisState) -> AxisState:
    query = state["query"]

    if "code" not in state.get("plan", []):
        return state

    # Deterministic placeholder generation. A production Code Agent would
    # prompt the configured LLM (axis.llm.get_llm()) with authorized schema
    # context from the Knowledge Agent's output and parse a SQL completion
    # from the response; that context (business_context / dataset schemas)
    # is already available on `state` from the knowledge node.
    llm = get_llm()
    _ = llm.invoke(f"Generate a read-only analytical SQL query for: {query}")

    keyword = query.split()[0] if query.split() else "fleet"
    candidate_sql = _SIMPLE_TEMPLATE.format(keyword=keyword)

    try:
        validated = validate_sql(candidate_sql)
        state["generated_sql"] = validated
        state["sql_validation_error"] = None
    except SqlValidationError as exc:
        state["generated_sql"] = None
        state["sql_validation_error"] = str(exc)

    state["status"] = "EXECUTING"
    state.setdefault("trace", []).append(
        {
            "agent": "Code Agent",
            "status": "COMPLETE" if state.get("generated_sql") else "FAILED",
            "summary": state.get("generated_sql") or state.get("sql_validation_error") or "no SQL required",
        }
    )
    return state
