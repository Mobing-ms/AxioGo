from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class CurrentUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    permissions: list[str]


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: str
    status: str
    avatar: str | None = None


class UserCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = "STANDARD_USER"

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v


class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8)
    username: str | None = None

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v


class VerifyEmailRequest(BaseModel):
    supabase_access_token: str = Field(min_length=1)


class RegisterResponse(BaseModel):
    success: bool = True
    message: str
    email: str
    verification_required: bool = True


class SyncPasswordRequest(BaseModel):
    supabase_access_token: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class GoogleAuthRequest(BaseModel):
    supabase_access_token: str | None = None
    email: EmailStr | None = None
    name: str | None = None


class UserUpdateRequest(BaseModel):
    role: str | None = None
    status: str | None = None
    name: str | None = None