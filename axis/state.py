"""
Shared graph state for the AXIS multi-agent workflow.

Per security.md #37, agents receive the requesting user's authorization
context alongside the query; no agent has more access than the user does.
The Coordinator decides routing; downstream agents only ever see data
that has already passed authorization checks upstream.
"""
from typing import Any, Literal, TypedDict

AxisExecutionStatus = Literal[
    "IDLE", "UNDERSTANDING", "CONTEXT", "PLANNING",
    "EXECUTING", "ANALYZING", "SYNTHESIZING", "COMPLETE", "FAILED",
]


class AuthContext(TypedDict):
    """The propagated identity — never expanded by any agent (security.md #36)."""

    user_id: str
    role: str
    permissions: list[str]


class AgentTrace(TypedDict):
    agent: str
    status: str
    summary: str


class AxisState(TypedDict, total=False):
    # Input
    query: str
    auth: AuthContext
    workspace_id: str | None
    dataset_id: str | None

    # Coordinator output
    intent: str  # e.g. "root_cause", "lookup", "report_request", "action_request"
    plan: list[str]  # which agents the coordinator decided to invoke

    # Working memory, populated as agents run
    business_context: list[dict[str, Any]]
    knowledge_snippets: list[dict[str, Any]]
    generated_sql: str | None
    sql_validation_error: str | None
    analysis: dict[str, Any] | None

    # Output
    status: AxisExecutionStatus
    answer: str
    recommendations: list[str]
    trace: list[AgentTrace]
