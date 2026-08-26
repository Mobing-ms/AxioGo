import asyncio
import json
import time
from dataclasses import dataclass
from typing import Dict, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.core.audit import write_audit_log
from app.core.deps import AuthenticatedUser, get_current_user
from app.core.security import (
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.user import (
    AuthProviderType,
    Role,
    RoleName,
    User,
    UserStatus,
)
from app.schemas.auth import (
    CurrentUserResponse,
    GoogleAuthRequest,
    LoginRequest,
    RefreshRequest,
    RegisterResponse,
    SyncPasswordRequest,
    TokenPair,
    UserRegisterRequest,
)

settings = get_settings()

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

GOOGLE_PLACEHOLDER_PASSWORD = (
    "AXIOGO_GOOGLE_ACCOUNT_DO_NOT_USE_AS_PASSWORD"
)

# Pending registrations are kept out of the database until the
# user's email/OTP is actually confirmed by Supabase.
PENDING_REGISTRATION_TTL_SECONDS = 15 * 60


# ============================================================
# REQUEST MODEL FOR SUPABASE TOKEN VERIFICATION
# ============================================================

class SupabaseTokenRequest(BaseModel):
    supabase_access_token: str = Field(min_length=1)


# ============================================================
# PENDING REGISTRATION STORE (LOCAL, PRE-DATABASE)
# ============================================================

@dataclass
class PendingRegistration:
    name: str
    email: str
    hashed_password: str
    created_at: float
    recycle_user_id: Optional[str] = None


_pending_registrations: Dict[str, PendingRegistration] = {}
_pending_lock = asyncio.Lock()


def _purge_expired_pending_locked() -> None:
    now = time.time()

    expired = [
        email
        for email, pending in _pending_registrations.items()
        if now - pending.created_at
        > PENDING_REGISTRATION_TTL_SECONDS
    ]

    for email in expired:
        _pending_registrations.pop(email, None)


async def _set_pending_registration(
    pending: PendingRegistration,
) -> None:
    async with _pending_lock:
        _purge_expired_pending_locked()
        _pending_registrations[pending.email] = pending


async def _pop_pending_registration(
    email: str,
) -> Optional[PendingRegistration]:
    async with _pending_lock:
        _purge_expired_pending_locked()
        return _pending_registrations.pop(email, None)


# ============================================================
# HELPERS
# ============================================================

def _error_message(error) -> str:
    if not error:
        return ""

    return str(
        getattr(error, "message", None)
        or getattr(error, "detail", None)
        or ""
    )


def _error_status(error) -> int:
    return int(
        getattr(error, "status", None)
        or getattr(error, "status_code", None)
        or 0
    )


async def _get_supabase_user(
    access_token: str,
) -> dict:
    """
    Validate a Supabase access token by asking Supabase Auth
    for the authenticated user.
    """

    if (
        not settings.SUPABASE_URL
        or not settings.SUPABASE_PUBLISHABLE_KEY
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase authentication is not configured.",
        )

    url = (
        f"{settings.SUPABASE_URL.rstrip('/')}"
        "/auth/v1/user"
    )

    request = Request(
        url,
        headers={
            "apikey": settings.SUPABASE_PUBLISHABLE_KEY,
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="GET",
    )

    def make_request():
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(
                    response.read().decode("utf-8")
                )

        except HTTPError as exc:
            try:
                exc.read()
            except Exception:
                pass

            raise ValueError(
                "Supabase rejected the authentication token."
            ) from exc

        except URLError as exc:
            raise ValueError(
                "Unable to connect to Supabase Auth."
            ) from exc

    try:
        return await asyncio.to_thread(make_request)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc


async def _supabase_user_exists(email: str) -> bool:
    """
    Ask Supabase's `profiles` table directly whether an account
    exists for this email, instead of trusting our own local
    `users` table.
    """

    if (
        not settings.SUPABASE_URL
        or not _supabase_admin_key()
        ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured.",
        )

    url = (
        f"{settings.SUPABASE_URL.rstrip('/')}"
        f"/rest/v1/profiles"
        f"?select=id&email=eq.{quote(email)}"
        f"&limit=1"
    )

    request = Request(
        url,
        headers={
            "apikey": _supabase_admin_key(),
    "Authorization": f"Bearer {_supabase_admin_key()}",
    "Content-Type": "application/json",
        },
        method="GET",
    )

    def make_request():
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(
                    response.read().decode("utf-8")
                )

        except HTTPError as exc:
            try:
                exc.read()
            except Exception:
                pass

            raise ValueError(
                "Supabase profiles lookup failed."
            ) from exc

        except URLError as exc:
            raise ValueError(
                "Unable to connect to Supabase."
            ) from exc

    try:
        rows = await asyncio.to_thread(make_request)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return bool(rows)


async def _supabase_username_exists(username: str) -> bool:
    """
    Check the `profiles` table for an existing username.
    """
    if (
        not settings.SUPABASE_URL
        or not _supabase_admin_key()
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured.",
        )

    url = (
        f"{settings.SUPABASE_URL.rstrip('/')}"
        f"/rest/v1/profiles"
        f"?select=id&username=eq.{quote(username)}"
        f"&limit=1"
    )

    request = Request(
        url,
        headers={
            "apikey": _supabase_admin_key(),
            "Authorization": f"Bearer {_supabase_admin_key()}",
            "Content-Type": "application/json",
        },
        method="GET",
    )

    def make_request():
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            try:
                exc.read()
            except Exception:
                pass
            raise ValueError("Supabase profiles lookup failed.") from exc
        except URLError as exc:
            raise ValueError("Unable to connect to Supabase.") from exc

    try:
        rows = await asyncio.to_thread(make_request)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return bool(rows)


def _normalize_supabase_role_name(raw_role: str) -> str:
    """
    Supabase's `profiles.role` values (e.g. 'AUTHORIZED USER')
    don't necessarily match the exact string format of your
    local RoleName enum. Normalize to UPPER_SNAKE_CASE so we can
    match against local role names regardless of whether they're
    'ADMIN', 'admin', 'AUTHORIZED_USER', etc.
    """
    return raw_role.strip().upper().replace(" ", "_").replace("-", "_")


async def _get_supabase_role(email: str) -> Optional[str]:
    """
    Look up the `role` column on the Supabase `profiles` table
    for this email. Returns the normalized role name, or None if
    no profile/role was found or the lookup failed - callers
    should fall back to the local role_id in that case.
    """

    if (
    not settings.SUPABASE_URL
    or not _supabase_admin_key()
    ):
        return None

    url = (
        f"{settings.SUPABASE_URL.rstrip('/')}"
        f"/rest/v1/profiles"
        f"?select=role&email=eq.{quote(email)}"
        f"&limit=1"
    )

    request = Request(
        url,
        headers={
            "apikey": _supabase_admin_key(),
            "Authorization": f"Bearer {_supabase_admin_key()}",
            "Content-Type": "application/json",
        },
        method="GET",
    )

    def make_request():
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(
                    response.read().decode("utf-8")
                )
        except (HTTPError, URLError):
            return None

    rows = await asyncio.to_thread(make_request)

    if not rows:
        return None

    raw_role = rows[0].get("role")

    if not raw_role:
        return None

    return _normalize_supabase_role_name(str(raw_role))


async def _get_or_create_role_by_name(
    db: AsyncSession,
    role_name: str,
) -> Role:
    result = await db.execute(
        select(Role).where(Role.name == role_name)
    )

    role = result.scalar_one_or_none()

    if role is None:
        role = Role(
            name=role_name,
            description=f"Auto-created from Supabase role '{role_name}'",
        )

        db.add(role)
        await db.flush()

    return role


async def _get_local_role_name(
    db: AsyncSession,
    user: User,
) -> str:
    result = await db.execute(
        select(Role).where(
            Role.id == user.role_id
        )
    )

    role = result.scalar_one_or_none()

    return (
        role.name
        if role
        else RoleName.STANDARD_USER.value
    )


async def _get_user_role(
    db: AsyncSession,
    user: User,
) -> str:
    """
    Resolve the role to embed in the JWT, AND keep the local
    `role_id` in sync with Supabase.

    Supabase's `profiles.role` is the source of truth. We try
    that first; if the profile/role doesn't exist there, or the
    Supabase call fails for any reason (network issue, RLS,
    misconfiguration), we fall back to the local `role_id` so
    login/verification never hard-fails because of this lookup.

    When a Supabase role IS found and it differs from the local
    `role_id`, we update the local row to match (find-or-create
    the matching local Role row) so both stay consistent, not
    just the JWT. The caller is expected to `db.commit()` shortly
    after (all current callers already do).
    """

    supabase_role = await _get_supabase_role(user.email)

    if supabase_role:
        local_role_name = await _get_local_role_name(db, user)

        if supabase_role != local_role_name:
            matching_role = await _get_or_create_role_by_name(
                db, supabase_role
            )

            user.role_id = matching_role.id
            await db.flush()

        return supabase_role

    return await _get_local_role_name(db, user)


async def _get_standard_role(
    db: AsyncSession,
) -> Role:
    result = await db.execute(
        select(Role).where(
            Role.name == RoleName.STANDARD_USER.value
        )
    )

    role = result.scalar_one_or_none()

    if role is None:
        role = Role(
            name=RoleName.STANDARD_USER.value,
            description="Standard AxioGo user",
        )

        db.add(role)
        await db.flush()

    return role


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Stage an AxioGo signup for a Supabase email/password user.

    - No row is written to the `users` table here.
    - The "does this account already exist" check now queries
      Supabase's `profiles` table directly (source of truth),
      NOT the local axiogo_dev.db - so deleting a user from
      Supabase no longer leaves a stale row here blocking
      re-registration.
    - The AxioGo user row is only created in `/verify-email`,
      once Supabase confirms the email/OTP.
    - No AxioGo JWT is issued here.
    """

    normalized_email = (
        payload.email.strip().lower()
    )

    # ========================================================
    # CHECK EXISTING USER - AGAINST SUPABASE, NOT LOCAL DB
    # ========================================================

    if await _supabase_user_exists(normalized_email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An account with this email address "
                "already exists. Please sign in instead."
            ),
        )

    normalized_username = payload.username.strip().lower()

    if await _supabase_username_exists(normalized_username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This username is already taken. "
                "Please choose a different one."
            ),
    )
    # ========================================================
    # CHECK LOCAL ROW - ONLY TO DECIDE GOOGLE-RECYCLE, NOT TO BLOCK
    # ========================================================

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    existing_user = result.scalar_one_or_none()

    recycle_user_id: Optional[str] = None

    if (
        existing_user is not None
        and existing_user.auth_provider
        == AuthProviderType.GOOGLE.value
    ):
        recycle_user_id = str(existing_user.id)

    # ========================================================
    # STAGE PENDING REGISTRATION (NO DB WRITE)
    # ========================================================

    await _set_pending_registration(
        PendingRegistration(
            name=payload.name.strip(),
            email=normalized_email,
            hashed_password=hash_password(
                payload.password
            ),
            created_at=time.time(),
            recycle_user_id=recycle_user_id,
        )
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return RegisterResponse(
        message=(
            "Account details accepted. Please check "
            "your email for the verification code."
        ),
        email=normalized_email,
    )


# ============================================================
# VERIFY EMAIL
# ============================================================

@router.post(
    "/verify-email",
    response_model=TokenPair,
)
async def verify_email(
    payload: SupabaseTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Create/activate the AxioGo LOCAL account only after
    Supabase confirms the user's email (OTP verified).
    """

    supabase_user = await _get_supabase_user(
        payload.supabase_access_token
    )

    email = str(
        supabase_user.get("email") or ""
    ).strip().lower()

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Supabase did not return "
                "a verified email address."
            ),
        )

    # ========================================================
    # CRITICAL VERIFICATION CHECK
    # ========================================================

    if not supabase_user.get(
        "email_confirmed_at"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your email "
                "before continuing."
            ),
        )

    # ========================================================
    # PULL PENDING REGISTRATION DATA (IF ANY)
    # ========================================================

    pending = await _pop_pending_registration(email)

    # ========================================================
    # FIND AXIOGO USER
    # ========================================================

    result = await db.execute(
        select(User).where(
            func.lower(User.email) == email
        )
    )

    user = result.scalar_one_or_none()

    role = await _get_standard_role(db)

    # ========================================================
    # CASE 1: NO EXISTING ROW -> CREATE ONE NOW
    # ========================================================

    if user is None:

        if pending is not None:
            name = pending.name
            hashed_password = pending.hashed_password
        else:
            metadata = (
                supabase_user.get("user_metadata")
                or {}
            )

            name = (
                metadata.get("full_name")
                or metadata.get("name")
                or email.split("@")[0]
            ).strip()

            hashed_password = hash_password(
                GOOGLE_PLACEHOLDER_PASSWORD
            )

        user = User(
            name=name,
            email=email,
            hashed_password=hashed_password,
            role_id=role.id,
            auth_provider=AuthProviderType.LOCAL.value,
            status=UserStatus.ACTIVE.value,
        )

        db.add(user)

        try:
            await db.flush()

        except IntegrityError as exc:
            await db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "An account with this email "
                    "already exists."
                ),
            ) from exc

        await write_audit_log(
            db,
            user_id=user.id,
            role=RoleName.STANDARD_USER.value,
            event=(
                "auth.register_completed"
                if pending is not None
                else "auth.verify_email_self_healed"
            ),
            resource="auth",
            action=(
                f"AxioGo record for {user.email} was "
                "created after OTP verification"
            ),
        )

    # ========================================================
    # CASE 2: EXISTING GOOGLE ROW -> RECYCLE TO LOCAL
    # ========================================================

    elif (
        user.auth_provider
        == AuthProviderType.GOOGLE.value
    ):
        if pending is None or pending.recycle_user_id != str(
            user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This account is not an "
                    "email/password account."
                ),
            )

        user.auth_provider = AuthProviderType.LOCAL.value
        user.name = pending.name
        user.hashed_password = pending.hashed_password

        await write_audit_log(
            db,
            user_id=user.id,
            role=RoleName.STANDARD_USER.value,
            event="auth.google_record_recycled",
            resource="auth",
            action=(
                f"Existing Google record for {user.email} "
                "was converted to a local account after "
                "OTP verification"
            ),
        )

    # ========================================================
    # CASE 3: EXISTING LOCAL ROW (STALE, PRE-CHANGE, OR RETRY)
    # ========================================================

    elif (
        user.auth_provider
        == AuthProviderType.LOCAL.value
    ):
        if pending is not None:
            user.name = pending.name
            user.hashed_password = pending.hashed_password

        if pending is None and user.status == UserStatus.ACTIVE.value:
            pass

    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This account is not an "
                "email/password account."
            ),
        )

    # ========================================================
    # ACTIVATE LOCAL ACCOUNT
    # ========================================================

    user.status = UserStatus.ACTIVE.value

    role_name = await _get_user_role(
        db,
        user,
    )

    # ========================================================
    # CREATE AXIOGO TOKENS
    # ========================================================

    access_token = create_access_token(
        user.id,
        role_name,
    )

    refresh_token = create_refresh_token(
        user.id,
    )

    await write_audit_log(
        db,
        user_id=user.id,
        role=role_name,
        event="auth.email_verified",
        resource="auth",
        action=(
            f"User {user.email} verified "
            "their email"
        ),
    )

    await db.commit()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
    )


# ============================================================
# SYNC PASSWORD
# ============================================================

@router.post(
    "/sync-password",
)
async def sync_password(
    payload: SyncPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Synchronize a Supabase password reset with the
    AxioGo password hash.
    """

    supabase_user = await _get_supabase_user(
        payload.supabase_access_token
    )

    email = str(
        supabase_user.get("email") or ""
    ).strip().lower()

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Supabase did not return "
                "a verified email address."
            ),
        )

    # ========================================================
    # FIND USER
    # ========================================================

    result = await db.execute(
        select(User).where(
            func.lower(User.email) == email
        )
    )

    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "AxioGo account was not found "
                "for this email address."
            ),
        )

    # ========================================================
    # GOOGLE ACCOUNT
    # ========================================================

    if (
        user.auth_provider
        != AuthProviderType.LOCAL.value
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This account uses Google sign-in. "
                "Please continue with Google."
            ),
        )

    # ========================================================
    # UPDATE PASSWORD
    # ========================================================

    user.hashed_password = hash_password(
        payload.new_password
    )

    user.status = UserStatus.ACTIVE.value

    await write_audit_log(
        db,
        user_id=user.id,
        role=await _get_user_role(db, user),
        event="auth.password_synced",
        resource="auth",
        action=(
            f"User {user.email} completed a password "
            "reset and their AxioGo password was re-synced"
        ),
    )

    await db.commit()

    return {
        "success": True,
        "data": {
            "message": "Password updated.",
        },
    }


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=TokenPair,
)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    normalized_email = (
        payload.email.strip().lower()
    )

    # ========================================================
    # FIND USER
    # ========================================================

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    user = result.scalar_one_or_none()

    # ========================================================
    # GOOGLE ACCOUNT
    # ========================================================

    if (
        user is not None
        and user.auth_provider
        == AuthProviderType.GOOGLE.value
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This account was created with Google. "
                "Please continue with Google to sign in."
            ),
        )

    # ========================================================
    # INVALID PASSWORD
    # ========================================================

    if (
        user is None
        or not user.hashed_password
        or not verify_password(
            payload.password,
            user.hashed_password,
        )
    ):
        await write_audit_log(
            db,
            user_id=None,
            role="",
            event="auth.login_failed",
            resource="auth",
            action=(
                f"Failed login attempt "
                f"for {normalized_email}"
            ),
            severity="HIGH",
            status="FAILED",
        )

        await db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # ========================================================
    # EMAIL VERIFICATION
    # ========================================================

    if (
        user.status
        != UserStatus.ACTIVE.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your email "
                "before signing in."
            ),
        )

    # ========================================================
    # CREATE TOKENS
    # ========================================================

    role_name = await _get_user_role(
        db,
        user,
    )

    access_token = create_access_token(
        user.id,
        role_name,
    )

    refresh_token = create_refresh_token(
        user.id,
    )

    await write_audit_log(
        db,
        user_id=user.id,
        role=role_name,
        event="auth.login_success",
        resource="auth",
        action=(
            f"User {user.email} logged in"
        ),
    )

    await db.commit()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
    )


# ============================================================
# GOOGLE LOGIN
# ============================================================

@router.post(
    "/google",
    response_model=TokenPair,
)
async def google_auth(
    payload: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    # ========================================================
    # VALIDATE SUPABASE GOOGLE SESSION
    # ========================================================

    if payload.supabase_access_token:

        supabase_user = await _get_supabase_user(
            payload.supabase_access_token
        )

        normalized_email = str(
            supabase_user.get("email") or ""
        ).strip().lower()

        if not normalized_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Google authentication did not "
                    "return an email address."
                ),
            )

        app_metadata = (
            supabase_user.get("app_metadata")
            or {}
        )

        identities = (
            supabase_user.get("identities")
            or []
        )

        provider = app_metadata.get(
            "provider"
        )

        has_google_identity = (
            provider == "google"
            or any(
                identity.get("provider")
                == "google"
                for identity in identities
            )
        )

        if not has_google_identity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The supplied session is not "
                    "a Google authentication session."
                ),
            )

        metadata = (
            supabase_user.get("user_metadata")
            or {}
        )

        display_name = (
            metadata.get("full_name")
            or metadata.get("name")
            or normalized_email.split("@")[0]
        ).strip()

    # ========================================================
    # FALLBACK EMAIL AUTH REQUEST
    # ========================================================

    elif payload.email:

        normalized_email = (
            payload.email.strip().lower()
        )

        display_name = (
            payload.name
            or normalized_email.split("@")[0]
        ).strip()

    else:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Either supabase_access_token "
                "or email is required."
            ),
        )

    # ========================================================
    # FIND USER
    # ========================================================

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    user = result.scalar_one_or_none()

    # ========================================================
    # CREATE GOOGLE USER
    # ========================================================

    if user is None:

        role = await _get_standard_role(db)

        user = User(
            name=display_name,
            email=normalized_email,
            hashed_password=hash_password(
                GOOGLE_PLACEHOLDER_PASSWORD
            ),
            role_id=role.id,
            auth_provider=(
                AuthProviderType.GOOGLE.value
            ),
            status=(
                UserStatus.ACTIVE.value
            ),
        )

        db.add(user)

        try:
            await db.flush()

        except IntegrityError as exc:
            await db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "An account with this email "
                    "already exists."
                ),
            ) from exc

    # ========================================================
    # EXISTING LOCAL ACCOUNT
    # ========================================================

    elif (
        user.auth_provider
        == AuthProviderType.LOCAL.value
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An email/password account already "
                "exists for this email. Please sign "
                "in with your email and password."
            ),
        )

    # ========================================================
    # EXISTING GOOGLE ACCOUNT
    # ========================================================

    else:

        user.status = (
            UserStatus.ACTIVE.value
        )

    # ========================================================
    # CREATE TOKENS
    # ========================================================

    role_name = await _get_user_role(
        db,
        user,
    )

    access_token = create_access_token(
        user.id,
        role_name,
    )

    refresh_token = create_refresh_token(
        user.id,
    )

    await write_audit_log(
        db,
        user_id=user.id,
        role=role_name,
        event="auth.google_login_success",
        resource="auth",
        action=(
            f"User {user.email} "
            "logged in via Google"
        ),
    )

    await db.commit()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
    )


# ============================================================
# REFRESH
# ============================================================

@router.post(
    "/refresh",
    response_model=TokenPair,
)
async def refresh(
    payload: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    try:

        decoded = decode_token(
            payload.refresh_token,
            expected_type="refresh",
        )

    except TokenError as exc:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    user_id = decoded.get("sub")

    # ========================================================
    # FIND USER
    # ========================================================

    result = await db.execute(
        select(User).where(
            User.id == user_id
        )
    )

    user = result.scalar_one_or_none()

    if (
        user is None
        or user.status
        != UserStatus.ACTIVE.value
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User inactive or not found",
        )

    # ========================================================
    # ROLE
    # ========================================================

    role_name = await _get_user_role(
        db,
        user,
    )

    # ========================================================
    # NEW TOKENS
    # ========================================================

    tokens = TokenPair(
        access_token=create_access_token(
            user.id,
            role_name,
        ),
        refresh_token=create_refresh_token(
            user.id,
        ),
    )

    # Persist any local role_id sync performed by _get_user_role.
    await db.commit()

    return tokens


# ============================================================
# LOGOUT
# ============================================================

@router.post("/logout")
async def logout(
    current_user: AuthenticatedUser =
        Depends(get_current_user),
    db: AsyncSession =
        Depends(get_db),
):
    await write_audit_log(
        db,
        user_id=current_user.id,
        role=current_user.role,
        event="auth.logout",
        resource="auth",
        action=(
            f"User {current_user.email} logged out"
        ),
    )

    await db.commit()

    return {
        "success": True,
        "data": {
            "message": "Logged out",
        },
    }

def _supabase_admin_key() -> str | None:
    """
    Prefer the service-role secret key for backend-only, RLS-bypassing
    reads (profiles lookups). Falls back to the publishable/anon key
    if the secret key isn't configured, so existing behavior (and its
    RLS limitations) is preserved rather than crashing.
    """
    return settings.SUPABASE_SECRET_KEY or settings.SUPABASE_PUBLISHABLE_KEY

# ============================================================
# CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
async def me(
    current_user: AuthenticatedUser =
        Depends(get_current_user),
) -> CurrentUserResponse:

    return CurrentUserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        permissions=sorted(
            current_user.permissions
        ),
    )

    