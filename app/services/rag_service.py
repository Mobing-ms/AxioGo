"""
RAG retrieval with authorization applied before content reaches the LLM
(security.md #9-11): "The LLM must never receive unauthorized business-
context documents." This module is the enforcement point; the Knowledge
Agent only ever calls `search_knowledge`, never queries the table directly.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge import KnowledgeDocument


async def search_knowledge(db: AsyncSession, *, workspace_id: str, role: str, query: str, limit: int = 5) -> list[dict]:
    result = await db.execute(
        select(KnowledgeDocument).where(
            KnowledgeDocument.workspace_id == workspace_id,
            KnowledgeDocument.status == "ACTIVE",
        )
    )
    documents = result.scalars().all()

    # Authorization filter FIRST — unauthorized docs are dropped before any
    # relevance scoring or LLM exposure, never filtered after the fact.
    authorized = [doc for doc in documents if role in (doc.allowed_roles or "").split(",")]

    query_lower = query.lower()
    scored = sorted(
        authorized,
        key=lambda d: (query_lower in d.title.lower()),
        reverse=True,
    )

    return [
        {
            "document_id": doc.id,
            "title": doc.title,
            "document_type": doc.document_type,
            "source_uri": doc.source_uri,
            "classification": doc.classification,
        }
        for doc in scored[:limit]
    ]
