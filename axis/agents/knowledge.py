"""
2. Knowledge / Metadata Agent

Retrieves schema, business glossary, KPI definitions, and approved
knowledge documents. All retrieval passes through the authorization filter
in app.services.rag_service — this agent never queries tables directly, so
it structurally cannot leak an unauthorized document (security.md #9-11).
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge import BusinessContext
from app.services.rag_service import search_knowledge
from axis.state import AxisState


async def knowledge_node(state: AxisState, db: AsyncSession) -> AxisState:
    auth = state["auth"]
    workspace_id = state.get("workspace_id")

    business_context: list[dict] = []
    if workspace_id:
        result = await db.execute(
            select(BusinessContext).where(
                BusinessContext.workspace_id == workspace_id,
                BusinessContext.status == "ACTIVE",
            )
        )
        business_context = [
            {"name": bc.name, "type": bc.type, "content": bc.content} for bc in result.scalars().all()
        ]

        knowledge_snippets = await search_knowledge(
            db, workspace_id=workspace_id, role=auth["role"], query=state["query"]
        )
    else:
        knowledge_snippets = []

    state["business_context"] = business_context
    state["knowledge_snippets"] = knowledge_snippets
    state["status"] = "CONTEXT"
    state.setdefault("trace", []).append(
        {
            "agent": "Knowledge / Metadata Agent",
            "status": "COMPLETE",
            "summary": f"{len(business_context)} context item(s), {len(knowledge_snippets)} authorized document(s)",
        }
    )
    return state
