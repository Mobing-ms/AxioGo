import pytest


async def _login(client, email, password):
    r = await client.post("/auth/login", json={"email": email, "password": password})
    return r.json()["access_token"]


@pytest.mark.asyncio
async def test_standard_user_cannot_read_audit(client):
    token = await _login(client, "standard@test.dev", "stdpass123")
    r = await client.get("/audit", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_admin_can_read_audit(client):
    token = await _login(client, "admin@test.dev", "adminpass123")
    r = await client.get("/audit", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_standard_user_cannot_manage_users(client):
    token = await _login(client, "standard@test.dev", "stdpass123")
    r = await client.post(
        "/users",
        json={"name": "New", "email": "new@test.dev", "password": "newpassword123", "role": "STANDARD_USER"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_unauthenticated_request_rejected(client):
    r = await client.get("/users")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_authorized_user_can_create_actions_but_not_approve(client):
    token = await _login(client, "authorized@test.dev", "authpass123")
    headers = {"Authorization": f"Bearer {token}"}

    r = await client.post(
        "/actions",
        json={"decision_id": "fake-decision-id", "title": "Test action", "risk": "LOW"},
        headers=headers,
    )
    assert r.status_code == 201

    action_id = r.json()["id"]
    r2 = await client.post(f"/actions/{action_id}/approve", headers=headers)
    assert r2.status_code == 403
