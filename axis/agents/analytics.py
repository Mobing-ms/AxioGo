"""
4. Analytics & Insight Agent

Consumes authorized context (business_context, knowledge_snippets,
generated_sql/results) and produces the final business-friendly answer,
metrics, and recommendations. Never bypasses authorization — it only ever
sees what upstream agents already filtered for this user.
"""
from axis.llm import get_llm
from axis.state import AxisState


def analytics_node(state: AxisState) -> AxisState:
    llm = get_llm()

    context_summary = "; ".join(bc["name"] for bc in state.get("business_context", [])) or "no matching business context"
    sources = [s["title"] for s in state.get("knowledge_snippets", [])]

    prompt = (
        f"User question: {state['query']}\n"
        f"Authorized business context: {context_summary}\n"
        f"Generated SQL (validated, not yet executed against Databricks): {state.get('generated_sql')}\n"
        "Synthesize a concise, business-friendly answer."
    )
    llm_output = llm.invoke(prompt)

    if state.get("sql_validation_error"):
        answer = (
            f"I couldn't safely generate a query for that question: {state['sql_validation_error']}. "
            "Try rephrasing it as a specific analytical question."
        )
        recommendations: list[str] = []
    elif state.get("generated_sql"):
        answer = (
            f"Based on {context_summary}, here is what I found for: \"{state['query']}\". "
            f"{llm_output}"
        )
        recommendations = [
            "Review the generated query before relying on results in a live report.",
            "Connect a real Databricks SQL warehouse to replace the simulated result set.",
        ]
    else:
        answer = f"{llm_output}" if sources or state.get("business_context") else (
            f"I don't have authorized business context or knowledge documents for \"{state['query']}\" yet. "
            "Try asking about a dataset or KPI that's been onboarded to this workspace."
        )
        recommendations = []

    state["analysis"] = {
        "answer": answer,
        "sources": sources,
        "metrics": [],
    }
    state["answer"] = answer
    state["recommendations"] = recommendations
    state["status"] = "SYNTHESIZING"
    state.setdefault("trace", []).append(
        {"agent": "Analytics & Insight Agent", "status": "COMPLETE", "summary": "synthesized final answer"}
    )
    return state
