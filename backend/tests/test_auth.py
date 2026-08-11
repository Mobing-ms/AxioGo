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


@pytest.mark.asyncio
async def test_register_success(client):
    r = await client.post(
        "/auth/register",
        json={"name": "New User", "email": "newuser@test.dev", "password": "securepassword123"},
    )
    assert r.status_code == 201
    body = r.json()
    assert "access_token" in body and "refresh_token" in body


@pytest.mark.asyncio
async def test_register_duplicate_email_409(client):
    payload = {"name": "Dup User", "email": "dupuser@test.dev", "password": "securepassword123"}
    r1 = await client.post("/auth/register", json=payload)
    assert r1.status_code == 201

    r2 = await client.post("/auth/register", json=payload)
    assert r2.status_code == 409
    assert "already exists" in r2.json()["error"]["message"]


@pytest.mark.asyncio
async def test_register_case_insensitive_duplicate_email_409(client):
    p1 = {"name": "Case User", "email": "caseuser@test.dev", "password": "securepassword123"}
    r1 = await client.post("/auth/register", json=p1)
    assert r1.status_code == 201

    p2 = {"name": "Case User Upper", "email": "  CaseUser@TEST.Dev ", "password": "securepassword123"}
    r2 = await client.post("/auth/register", json=p2)
    assert r2.status_code == 409


@pytest.mark.asyncio
async def test_login_case_insensitive(client):
    r = await client.post("/auth/login", json={"email": " ADMIN@TEST.DEV ", "password": "adminpass123"})
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_google_auth_and_password_login_rejection(client):
    # 1. Sign in with Google
    g_res = await client.post("/auth/google", json={"email": "googleuser@test.dev", "name": "Google User"})
    assert g_res.status_code == 200
    assert "access_token" in g_res.json()

    # 2. Attempt password login for the Google account
    l_res = await client.post("/auth/login", json={"email": "googleuser@test.dev", "password": "anyPassword123!"})
    assert l_res.status_code == 400
    assert "created with Google" in l_res.json()["error"]["message"]

    # 3. Attempt registration with password for the Google account
    r_res = await client.post("/auth/register", json={"name": "Dup Google", "email": "googleuser@test.dev", "password": "anyPassword123!"})
    assert r_res.status_code == 409
    assert "created with Google" in r_res.json()["error"]["message"]


