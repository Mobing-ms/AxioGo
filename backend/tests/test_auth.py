import pytest


@pytest.mark.asyncio
async def test_login_success(client):
    r = await client.post("/auth/login", json={"email": "admin@test.dev", "password": "adminpass123"})
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body and "refresh_token" in body


@pytest.mark.asyncio
async def test_login_invalid_password(client):
    r = await client.post("/auth/login", json={"email": "admin@test.dev", "password": "wrong-password"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email(client):
    r = await client.post("/auth/login", json={"email": "nobody@test.dev", "password": "whatever123"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_me_requires_auth(client):
    r = await client.get("/auth/me")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_role_and_permissions(client):
    login = await client.post("/auth/login", json={"email": "admin@test.dev", "password": "adminpass123"})
    token = login.json()["access_token"]
    r = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    body = r.json()
    assert body["role"] == "ADMIN"
    assert "users:manage" in body["permissions"]
