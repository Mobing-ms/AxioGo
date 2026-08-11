"""
6. Workflow Agent

Per security.md #44 ("LLM proposes. Backend verifies. Authorization
decides. Human approves when required. Backend executes."), this node's
authority is strictly limited to *proposing* that an action might be
warranted. It NEVER creates, approves, or executes an Action row directly —
that only happens through the dedicated, permission-checked endpoints in
app/api/v1/actions.py (POST /actions, /approve, /reject, /execute), which
independently re-verify risk and approval requirements.

This node only decides what to *suggest* to the user/frontend.
"""
from axis.state import AxisState


def workflow_node(state: AxisState) -> AxisState:
    if "workflow" not in state.get("plan", []):
        return state

    state.setdefault("recommendations", []).append(
        "This looks like an action request. I can propose it via POST /actions — high-risk actions will "
        "require human approval before anything executes."
    )
    state.setdefault("trace", []).append(
        {
            "agent": "Workflow Agent",
            "status": "COMPLETE",
            "summary": "Flagged as a potential action proposal (not executed — proposal only).",
        }
    )
    return state
