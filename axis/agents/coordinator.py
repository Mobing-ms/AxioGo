"""
1. Coordinator Agent

Plans requests, selects which downstream agents run, and determines
whether the resulting action needs approval. Uses lightweight keyword
heuristics as a deterministic default (works identically with or without
an LLM key); a configured LLM can refine this later without changing the
graph shape.
"""
from axis.state import AxisState

_ACTION_HINTS = ("dispatch", "trigger", "execute", "approve", "reserve", "notify", "send")
_REPORT_HINTS = ("report", "export", "pdf", "excel", "powerpoint", "summarize as")
_SQL_HINTS = ("how many", "count", "average", "total", "trend", "compare", "increase", "decrease", "cost", "why")


def coordinator_node(state: AxisState) -> AxisState:
    query_lower = state["query"].lower()

    plan: list[str] = ["knowledge"]  # business context is (almost) always useful
    if any(h in query_lower for h in _SQL_HINTS):
        plan.append("code")
        plan.append("analytics")
    if any(h in query_lower for h in _REPORT_HINTS):
        plan.append("report")
    if any(h in query_lower for h in _ACTION_HINTS):
        plan.append("workflow")

    if "code" not in plan and "workflow" not in plan and "report" not in plan:
        intent = "lookup"
    elif "workflow" in plan:
        intent = "action_request"
    elif "report" in plan:
        intent = "report_request"
    else:
        intent = "root_cause"

    state["intent"] = intent
    state["plan"] = plan
    state["status"] = "PLANNING"
    state.setdefault("trace", []).append(
        {"agent": "Coordinator Agent", "status": "COMPLETE", "summary": f"intent={intent}, plan={plan}"}
    )
    return state
