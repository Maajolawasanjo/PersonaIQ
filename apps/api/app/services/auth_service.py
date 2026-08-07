from datetime import datetime, timedelta, timezone
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.errors import AppException, ErrorCode
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.dto.auth import AuthTokenDTO, RefreshTokenRequest, SignInRequest, SignUpRequest
from app.dto.user import OnboardingRequest, UpdateProfileRequest, UserDTO
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def sign_up(self, request: SignUpRequest) -> AuthTokenDTO:
        existing = await self.repo.get_by_email(request.email)
        if existing:
            raise AppException(
                code=ErrorCode.USER_002,
                message="An account with this email address already exists.",
                status_code=400,
            )

        hashed_pw = hash_password(request.password)
        user = await self.repo.create(
            email=request.email,
            hashed_password=hashed_pw,
            first_name=request.first_name,
            last_name=request.last_name,
        )

        return await self._generate_auth_tokens(user)

    async def sign_in(self, request: SignInRequest) -> AuthTokenDTO:
        user = await self.repo.get_by_email(request.email)
        if not user:
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )

        # Check Lockout
        if user.locked_until and user.locked_until > datetime.now(timezone.utc):
            remaining_seconds = int((user.locked_until - datetime.now(timezone.utc)).total_seconds())
            raise AppException(
                code=ErrorCode.AUTH_003,
                message=f"Account locked due to multiple failed login attempts. Try again in {remaining_seconds // 60 + 1} minutes.",
                status_code=423,
            )

        # Verify Password
        if not verify_password(request.password, user.hashed_password):
            await self.repo.increment_failed_logins(user)
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )

        # Reset failed attempts on success
        await self.repo.reset_failed_logins(user)

        return await self._generate_auth_tokens(user)

    async def refresh_tokens(self, request: RefreshTokenRequest) -> AuthTokenDTO:
        token_h = hash_token(request.refresh_token)
        token_entry = await self.repo.get_refresh_token(token_h)

        if not token_entry or token_entry.expires_at < datetime.now(timezone.utc):
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Refresh token is invalid or expired.",
                status_code=401,
            )

        # Revoke used refresh token (Token rotation)
        await self.repo.revoke_refresh_token(token_h)

        user = token_entry.user
        return await self._generate_auth_tokens(user)

    async def logout(self, refresh_token: str) -> None:
        token_h = hash_token(refresh_token)
        await self.repo.revoke_refresh_token(token_h)

    async def complete_onboarding(self, user_id: UUID, request: OnboardingRequest) -> UserDTO:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        user.first_name = request.first_name
        user.last_name = request.last_name
        user.occupation = request.occupation
        user.onboarding_completed = True

        if request.default_event_type and user.preference:
            user.preference.default_event_type = request.default_event_type

        return UserDTO.model_validate(user)

    async def update_profile(self, user_id: UUID, request: UpdateProfileRequest) -> UserDTO:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        if request.first_name is not None:
            user.first_name = request.first_name
        if request.last_name is not None:
            user.last_name = request.last_name
        if request.occupation is not None:
            user.occupation = request.occupation
        if request.country is not None:
            user.country = request.country
        if request.timezone is not None:
            user.timezone = request.timezone

        return UserDTO.model_validate(user)

    async def _generate_auth_tokens(self, user) -> AuthTokenDTO:
        access_t = create_access_token(subject=str(user.id))
        refresh_t = create_refresh_token(subject=str(user.id))

        token_h = hash_token(refresh_t)
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        await self.repo.create_refresh_token(
            user_id=user.id, token_hash=token_h, expires_at=expires_at
        )

        return AuthTokenDTO(
            access_token=access_t,
            refresh_token=refresh_t,
            token_type="Bearer",
            user=UserDTO.model_validate(user),
        )
