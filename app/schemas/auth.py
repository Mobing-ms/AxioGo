from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


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
    id: str
    name: str
    email: str
    role: str
    status: str
    avatar: str | None = None

    class Config:
        from_attributes = True


class UserCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = "STANDARD_USER"


class UserUpdateRequest(BaseModel):
    role: str | None = None
    status: str | None = None
    name: str | None = None
