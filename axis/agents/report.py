"""
5. Report Agent

Per api.md's end-to-end flow, report *generation* happens through the
dedicated, separately-authorized `/reports` endpoints (app/api/v1/reports.py)
against an already-created Decision — not directly inside the AXIS
question-answering turn. This node's job inside the graph is narrow: detect
that the user's question implies a report deliverable and surface that as a
recommendation, so the frontend can offer a "Generate Report" action that
calls POST /reports with the resulting decision_id.
"""
from axis.state import AxisState


def report_node(state: AxisState) -> AxisState:
    if "report" not in state.get("plan", []):
        return state

    state.setdefault("recommendations", []).append(
        "This looks like a report request — once reviewed, generate a formal report via POST /reports "
        "referencing the resulting decision (subject to your reports:create permission)."
    )
    state.setdefault("trace", []).append(
        {
            "agent": "Report Agent",
            "status": "COMPLETE",
            "summary": "Flagged for report generation via the authorized /reports API (not auto-generated).",
        }
    )
    return state
