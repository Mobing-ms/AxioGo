"""
LangGraph orchestration for AXIS.

    Coordinator -> Knowledge -> Code -> Analytics -> Report -> Workflow -> END

Code/Report/Workflow nodes are no-ops when the Coordinator's plan doesn't
call for them (see each node's early-return). The graph is rebuilt per
request via `build_axis_graph(db)` because the Knowledge Agent needs an
authorized, request-scoped AsyncSession — LangGraph graphs are cheap to
compile and this avoids ever leaking one request's DB session into another.
"""
from functools import partial

from sqlalchemy.ext.asyncio import AsyncSession

from langgraph.graph import END, StateGraph

from axis.agents.analytics import analytics_node
from axis.agents.code import code_node
from axis.agents.coordinator import coordinator_node
from axis.agents.knowledge import knowledge_node
from axis.agents.report import report_node
from axis.agents.workflow import workflow_node
from axis.state import AxisState


def build_axis_graph(db: AsyncSession):
    graph = StateGraph(AxisState)

    graph.add_node("coordinator", coordinator_node)
    graph.add_node("knowledge", partial(knowledge_node, db=db))
    graph.add_node("code", code_node)
    graph.add_node("analytics", analytics_node)
    graph.add_node("report", report_node)
    graph.add_node("workflow", workflow_node)

    graph.set_entry_point("coordinator")
    graph.add_edge("coordinator", "knowledge")
    graph.add_edge("knowledge", "code")
    graph.add_edge("code", "analytics")
    graph.add_edge("analytics", "report")
    graph.add_edge("report", "workflow")
    graph.add_edge("workflow", END)

    return graph.compile()


async def run_axis_query(
    db: AsyncSession,
    *,
    query: str,
    user_id: str,
    role: str,
    permissions: list[str],
    workspace_id: str | None,
    dataset_id: str | None,
) -> AxisState:
    app_graph = build_axis_graph(db)

    initial_state: AxisState = {
        "query": query,
        "auth": {"user_id": user_id, "role": role, "permissions": permissions},
        "workspace_id": workspace_id,
        "dataset_id": dataset_id,
        "status": "UNDERSTANDING",
        "recommendations": [],
        "trace": [],
    }

    final_state = await app_graph.ainvoke(initial_state)
    final_state["status"] = "COMPLETE"
    return final_state
