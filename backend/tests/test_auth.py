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
    # Registration no longer hands back usable tokens -- the account
    # is INACTIVE until Supabase email verification completes.
    assert "access_token" not in body
    assert body["email"] == "newuser@test.dev"


@pytest.mark.asyncio
async def test_register_creates_inactive_account_that_cannot_login(client):
    payload = {"name": "Pending User", "email": "pending@test.dev", "password": "securepassword123"}
    r = await client.post("/auth/register", json=payload)
    assert r.status_code == 201

    # Verification hasn't happened yet, so login must be blocked.
    l_res = await client.post("/auth/login", json={"email": "pending@test.dev", "password": "securepassword123"})
    assert l_res.status_code == 403
    assert "verify your email" in l_res.json()["error"]["message"].lower()


@pytest.mark.asyncio
async def test_register_retry_before_verification_is_not_trapped(client):
    payload = {"name": "Retry User", "email": "retry@test.dev", "password": "firstpassword123"}
    r1 = await client.post("/auth/register", json=payload)
    assert r1.status_code == 201

    # Simulate the person coming back and trying to sign up again
    # (e.g. the first attempt's backend sync failed, or they simply
    # retried) before ever verifying their email. This must succeed
    # rather than permanently 409ing them.
    payload2 = {"name": "Retry User", "email": "retry@test.dev", "password": "secondpassword123"}
    r2 = await client.post("/auth/register", json=payload2)
    assert r2.status_code == 201
    assert "access_token" not in r2.json()


@pytest.mark.asyncio
async def test_register_duplicate_active_email_409(client, db_session):
    from sqlalchemy import select

    from app.models.user import User, UserStatus

    payload = {"name": "Dup User", "email": "dupuser@test.dev", "password": "securepassword123"}
    r1 = await client.post("/auth/register", json=payload)
    assert r1.status_code == 201

    # Activate the account the way /auth/verify-email would, so a
    # second signup attempt is a genuine duplicate, not a retry.
    result = await db_session.execute(
        select(User).where(User.email == "dupuser@test.dev")
    )
    user = result.scalar_one()
    user.status = UserStatus.ACTIVE.value
    await db_session.commit()

    r2 = await client.post("/auth/register", json=payload)
    assert r2.status_code == 409
    assert "already exists" in r2.json()["error"]["message"]


@pytest.mark.asyncio
async def test_register_case_insensitive_duplicate_email_409(client, db_session):
    from sqlalchemy import select

    from app.models.user import User, UserStatus

    p1 = {"name": "Case User", "email": "caseuser@test.dev", "password": "securepassword123"}
    r1 = await client.post("/auth/register", json=p1)
    assert r1.status_code == 201

    result = await db_session.execute(
        select(User).where(User.email == "caseuser@test.dev")
    )
    user = result.scalar_one()
    user.status = UserStatus.ACTIVE.value
    await db_session.commit()

    p2 = {"name": "Case User Upper", "email": "  CaseUser@TEST.Dev ", "password": "securepassword123"}
    r2 = await client.post("/auth/register", json=p2)
    assert r2.status_code == 409


@pytest.mark.asyncio
async def test_register_case_insensitive_matches_same_pending_account(client, db_session):
    """A retry with different email casing should update the same
    still-unverified row rather than creating a second one."""
    from sqlalchemy import func, select

    from app.models.user import User

    p1 = {"name": "Case User", "email": "caseuser2@test.dev", "password": "firstpassword123"}
    r1 = await client.post("/auth/register", json=p1)
    assert r1.status_code == 201

    p2 = {"name": "Case User Upper", "email": "  CaseUser2@TEST.Dev ", "password": "secondpassword123"}
    r2 = await client.post("/auth/register", json=p2)
    assert r2.status_code == 201

    result = await db_session.execute(
        select(func.count()).select_from(User).where(
            func.lower(User.email) == "caseuser2@test.dev"
        )
    )
    assert result.scalar_one() == 1


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


def _fake_supabase_user(monkeypatch, email, *, confirmed=True, full_name=None):
    """Patch out the network call to Supabase Auth's /auth/v1/user
    endpoint so verify-email / sync-password can be exercised without
    a real Supabase project."""

    import app.api.v1.auth as auth_module

    async def _fake(_access_token):
        return {
            "email": email,
            "email_confirmed_at": "2026-01-01T00:00:00Z" if confirmed else None,
            "user_metadata": {"full_name": full_name} if full_name else {},
        }

    monkeypatch.setattr(auth_module, "_get_supabase_user", _fake)


@pytest.mark.asyncio
async def test_verify_email_self_heals_missing_local_record(client, monkeypatch):
    """Simulates Supabase confirming an email for a signup whose
    /auth/register call never landed in the AxioGo backend."""

    _fake_supabase_user(
        monkeypatch,
        "healed@test.dev",
        full_name="Healed User",
    )

    r = await client.post(
        "/auth/verify-email",
        json={"supabase_access_token": "fake-token"},
    )

    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body and "refresh_token" in body

    r = await client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert r.status_code == 200
    assert r.json()["email"] == "healed@test.dev"
    assert r.json()["name"] == "Healed User"


@pytest.mark.asyncio
async def test_verify_email_requires_confirmed_email(client, monkeypatch):
    _fake_supabase_user(monkeypatch, "unconfirmed@test.dev", confirmed=False)

    r = await client.post(
        "/auth/verify-email",
        json={"supabase_access_token": "fake-token"},
    )
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_sync_password_updates_login_credentials(client, monkeypatch):
    payload = {"name": "Sync User", "email": "syncme@test.dev", "password": "originalpass123"}
    r = await client.post("/auth/register", json=payload)
    assert r.status_code == 201

    _fake_supabase_user(monkeypatch, "syncme@test.dev")

    # Verify email first so the account is ACTIVE (mirrors the real flow).
    v = await client.post(
        "/auth/verify-email",
        json={"supabase_access_token": "fake-token"},
    )
    assert v.status_code == 200

    # Old password still works before any reset.
    l1 = await client.post("/auth/login", json={"email": "syncme@test.dev", "password": "originalpass123"})
    assert l1.status_code == 200

    # Simulate the Supabase-side password reset completing, then sync it.
    s = await client.post(
        "/auth/sync-password",
        json={"supabase_access_token": "fake-token", "new_password": "brandnewpass123"},
    )
    assert s.status_code == 200

    # Old password must no longer work; new one must.
    l2 = await client.post("/auth/login", json={"email": "syncme@test.dev", "password": "originalpass123"})
    assert l2.status_code == 401

    l3 = await client.post("/auth/login", json={"email": "syncme@test.dev", "password": "brandnewpass123"})
    assert l3.status_code == 200


@pytest.mark.asyncio
async def test_sync_password_rejects_google_account(client, monkeypatch):
    g_res = await client.post("/auth/google", json={"email": "googlesync@test.dev", "name": "Google Sync"})
    assert g_res.status_code == 200

    _fake_supabase_user(monkeypatch, "googlesync@test.dev")

    s = await client.post(
        "/auth/sync-password",
        json={"supabase_access_token": "fake-token", "new_password": "brandnewpass123"},
    )
    assert s.status_code == 409
    assert "Google" in s.json()["error"]["message"]