import asyncio
import json
from urllib.error import HTTPError, URLError
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


# ============================================================
# REQUEST MODEL FOR SUPABASE TOKEN VERIFICATION
# ============================================================

class SupabaseTokenRequest(BaseModel):
    supabase_access_token: str = Field(min_length=1)


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


async def _get_user_role(
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
    Create (or re-sync) the AxioGo backend record that mirrors a
    Supabase Auth signup.

    IMPORTANT: this endpoint intentionally does NOT return AxioGo
    access/refresh tokens. The account is created INACTIVE and can
    only become ACTIVE through /auth/verify-email, once Supabase has
    confirmed the user's email. Returning usable tokens here would let
    anyone skip email verification entirely.
    """

    normalized_email = (
        payload.email.strip().lower()
    )

    # --------------------------------------------------------
    # CHECK EXISTING USER
    # --------------------------------------------------------

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        if (
            existing_user.auth_provider
            == AuthProviderType.GOOGLE.value
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This account was created with Google. "
                    "Please continue with Google to sign in."
                ),
            )

        if (
            existing_user.status
            == UserStatus.ACTIVE.value
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "An account with this email address "
                    "already exists. Please sign in instead."
                ),
            )

        # --------------------------------------------------------
        # PARTIAL / UNVERIFIED SIGNUP RETRY
        #
        # A LOCAL user that is still INACTIVE means a previous signup
        # attempt never completed email verification (or the backend
        # sync step failed after Supabase already created the auth
        # user). Rather than trapping the person behind a permanent
        # "already exists" error they can never get past, refresh the
        # record in place so they can verify and continue.
        # --------------------------------------------------------

        existing_user.name = payload.name.strip()
        existing_user.hashed_password = hash_password(
            payload.password
        )

        await write_audit_log(
            db,
            user_id=existing_user.id,
            role=RoleName.STANDARD_USER.value,
            event="auth.register_retry",
            resource="auth",
            action=(
                f"User {existing_user.email} retried "
                "registration before verifying their email"
            ),
        )

        await db.commit()

        return RegisterResponse(
            message=(
                "Account details updated. Please check your "
                "email for the verification code."
            ),
            email=normalized_email,
        )

    # --------------------------------------------------------
    # STANDARD ROLE
    # --------------------------------------------------------

    role = await _get_standard_role(db)

    # --------------------------------------------------------
    # CREATE INACTIVE LOCAL USER (PENDING EMAIL VERIFICATION)
    # --------------------------------------------------------

    try:
        user = User(
            name=payload.name.strip(),
            email=normalized_email,
            hashed_password=hash_password(
                payload.password
            ),
            role_id=role.id,
            auth_provider=AuthProviderType.LOCAL.value,
            status=UserStatus.INACTIVE.value,
        )

        db.add(user)
        await db.flush()

    except IntegrityError as exc:
        await db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An account with this email address "
                "already exists."
            ),
        ) from exc

    await write_audit_log(
        db,
        user_id=user.id,
        role=RoleName.STANDARD_USER.value,
        event="auth.register_success",
        resource="auth",
        action=f"User {user.email} registered",
    )

    await db.commit()

    return RegisterResponse(
        message=(
            "Account created. Please check your email "
            "for the verification code."
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

    result = await db.execute(
        select(User).where(
            func.lower(User.email) == email
        )
    )

    user = result.scalar_one_or_none()

    if user is None:
        # --------------------------------------------------------
        # SELF-HEAL A PARTIAL SIGNUP
        #
        # Supabase already confirmed this email, but the AxioGo
        # backend never got (or lost) the matching user record --
        # e.g. the /auth/register call failed after signUp()
        # succeeded. Create the record now instead of leaving the
        # person stuck with a verified Supabase account and no way
        # into AxioGo.
        # --------------------------------------------------------

        role = await _get_standard_role(db)

        metadata = (
            supabase_user.get("user_metadata") or {}
        )

        display_name = (
            metadata.get("full_name")
            or metadata.get("name")
            or email.split("@")[0]
        ).strip()

        user = User(
            name=display_name,
            email=email,

            # No AxioGo password was ever captured for this
            # self-healed record; the account remains unusable
            # for direct login until the person sets a password
            # through the normal Forgot Password flow.
            hashed_password=hash_password(
                GOOGLE_PLACEHOLDER_PASSWORD
            ),

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
            event="auth.verify_email_self_healed",
            resource="auth",
            action=(
                f"AxioGo record for {user.email} was "
                "recreated during email verification "
                "after a partial signup"
            ),
        )

    elif (
        user.auth_provider
        != AuthProviderType.LOCAL.value
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This account is not an "
                "email/password account."
            ),
        )

    # Activate LOCAL account
    user.status = UserStatus.ACTIVE.value

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
# SYNC PASSWORD (FORGOT PASSWORD COMPLETION)
# ============================================================
#
# AxioGo's own /auth/login checks a password hash stored in the
# AxioGo database, not Supabase. When a user resets their password
# through Supabase (client-side supabase.auth.updateUser after the
# recovery-link flow), that change only exists in Supabase -- the
# AxioGo hash is never updated, so the person still can't log in
# with their new password. This endpoint closes that gap: it
# verifies the Supabase recovery session server-side, then updates
# the matching AxioGo user's hashed_password so login stays in sync.

@router.post(
    "/sync-password",
)
async def sync_password(
    payload: SyncPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
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

    user.hashed_password = hash_password(
        payload.new_password
    )

    # A password reset is a strong signal the person owns the
    # mailbox; also clears any lingering unverified state.
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

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    user = result.scalar_one_or_none()

    # --------------------------------------------------------
    # GOOGLE ACCOUNT
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # INVALID PASSWORD
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # EMAIL VERIFICATION
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # CREATE TOKENS
    # --------------------------------------------------------

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

        app_metadata = supabase_user.get("app_metadata") or {}
        identities = supabase_user.get("identities") or []
        provider = app_metadata.get("provider")

        has_google_identity = (
            provider == "google"
            or any(
                identity.get("provider") == "google"
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

        metadata = supabase_user.get("user_metadata") or {}
        display_name = (
            metadata.get("full_name")
            or metadata.get("name")
            or normalized_email.split("@")[0]
        ).strip()
    elif payload.email:
        normalized_email = payload.email.strip().lower()
        display_name = (payload.name or normalized_email.split("@")[0]).strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either supabase_access_token or email is required.",
        )

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    result = await db.execute(
        select(User).where(
            func.lower(User.email)
            == normalized_email
        )
    )

    user = result.scalar_one_or_none()

    # --------------------------------------------------------
    # CREATE GOOGLE USER
    # --------------------------------------------------------

    if user is None:

        role = await _get_standard_role(db)

        user = User(
            name=display_name,
            email=normalized_email,

            # Password field is unusable placeholder for Google auth
            hashed_password=hash_password(
                GOOGLE_PLACEHOLDER_PASSWORD
            ),

            role_id=role.id,

            auth_provider=
                AuthProviderType.GOOGLE.value,

            status=
                UserStatus.ACTIVE.value,
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

    # --------------------------------------------------------
    # EXISTING LOCAL ACCOUNT
    # --------------------------------------------------------

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

    else:
        user.status = UserStatus.ACTIVE.value

    # --------------------------------------------------------
    # TOKENS
    # --------------------------------------------------------

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

    role_name = await _get_user_role(
        db,
        user,
    )

    return TokenPair(
        access_token=create_access_token(
            user.id,
            role_name,
        ),
        refresh_token=create_refresh_token(
            user.id,
        ),
    )


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