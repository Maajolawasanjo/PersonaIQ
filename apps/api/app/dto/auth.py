from pydantic import BaseModel, EmailStr, Field
from app.dto.user import UserDTO


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=1)


class AuthTokenDTO(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    user: UserDTO
