import pytest


async def _login(client, email, password):
    r = await client.post("/auth/login", json={"email": email, "password": password})
    return r.json()["access_token"]


@pytest.mark.asyncio
async def test_high_risk_action_requires_approval_before_execution(client):
    token = await _login(client, "admin@test.dev", "adminpass123")
    headers = {"Authorization": f"Bearer {token}"}

    create = await client.post(
        "/actions",
        json={"decision_id": "fake-id", "title": "Trigger shop job", "risk": "HIGH"},
        headers=headers,
    )
    assert create.status_code == 201
    action = create.json()
    assert action["status"] == "AWAITING_APPROVAL"
    assert action["approval_required"] is True

    # Critical boundary: execution must be rejected before approval, even for an admin.
    execute_before = await client.post(f"/actions/{action['id']}/execute", headers=headers)
    assert execute_before.status_code == 403

    approve = await client.post(f"/actions/{action['id']}/approve", headers=headers)
    assert approve.status_code == 200
    assert approve.json()["status"] == "APPROVED"

    execute_after = await client.post(f"/actions/{action['id']}/execute", headers=headers)
    assert execute_after.status_code == 200
    assert execute_after.json()["status"] == "COMPLETED"


@pytest.mark.asyncio
async def test_low_risk_action_does_not_require_approval(client):
    token = await _login(client, "admin@test.dev", "adminpass123")
    headers = {"Authorization": f"Bearer {token}"}

    create = await client.post(
        "/actions",
        json={"decision_id": "fake-id", "title": "Refresh dashboard", "risk": "LOW"},
        headers=headers,
    )
    action = create.json()
    assert action["status"] == "AVAILABLE"
    assert action["approval_required"] is False

    execute = await client.post(f"/actions/{action['id']}/execute", headers=headers)
    assert execute.status_code == 200
    assert execute.json()["status"] == "COMPLETED"


@pytest.mark.asyncio
async def test_rejected_action_cannot_be_executed(client):
    token = await _login(client, "admin@test.dev", "adminpass123")
    headers = {"Authorization": f"Bearer {token}"}

    create = await client.post(
        "/actions",
        json={"decision_id": "fake-id", "title": "Risky job", "risk": "CRITICAL"},
        headers=headers,
    )
    action = create.json()

    reject = await client.post(f"/actions/{action['id']}/reject", json={"reason": "Too risky"}, headers=headers)
    assert reject.status_code == 200
    assert reject.json()["status"] == "REJECTED"

    execute = await client.post(f"/actions/{action['id']}/execute", headers=headers)
    assert execute.status_code == 403
