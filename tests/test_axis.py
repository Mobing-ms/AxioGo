from axis.agents.coordinator import coordinator_node


def _state(query: str):
    return {"query": query, "trace": []}


def test_coordinator_routes_lookup_to_knowledge_only():
    state = coordinator_node(_state("what is our data retention policy"))
    assert state["intent"] == "lookup"
    assert state["plan"] == ["knowledge"]


def test_coordinator_routes_analytical_question_to_code_and_analytics():
    state = coordinator_node(_state("what is the average maintenance cost this quarter"))
    assert "code" in state["plan"]
    assert "analytics" in state["plan"]
    assert state["intent"] == "root_cause"


def test_coordinator_routes_action_request_to_workflow():
    state = coordinator_node(_state("dispatch a preventative maintenance alert"))
    assert "workflow" in state["plan"]
    assert state["intent"] == "action_request"


def test_coordinator_routes_report_request():
    state = coordinator_node(_state("export this analysis as a pdf report"))
    assert "report" in state["plan"]
    assert state["intent"] == "report_request"
