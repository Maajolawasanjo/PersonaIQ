from datetime import datetime, timedelta, timezone
from uuid import UUID
from typing import Optional, Any
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

    def _ensure_utc(self, dt: Optional[datetime]) -> Optional[datetime]:
        if not dt:
            return None
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt

    async def sign_up(self, request: SignUpRequest, background_tasks: Optional[Any] = None) -> AuthTokenDTO:
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

        # Generate and save OTP for verification
        import secrets
        from app.services.email_service import EmailService

        otp = f"{secrets.randbelow(900000) + 100000}"
        user.otp_code = otp
        user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        await self.repo.db.flush()

        # Send verification email via FastAPI BackgroundTasks — returns HTTP response immediately
        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_email_verification_email,
            user.email,
            otp,
        )

        return await self._generate_auth_tokens(user)

    async def verify_otp(self, email: str, code: str, background_tasks: Optional[Any] = None) -> AuthTokenDTO:
        user = await self.repo.get_by_email(email)
        if not user:
            raise AppException(
                code=ErrorCode.USER_001,
                message="User not found.",
                status_code=404,
            )

        if not user.otp_code or user.otp_code != code:
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid verification code.",
                status_code=400,
            )

        if not user.otp_expires_at or self._ensure_utc(user.otp_expires_at) < datetime.now(timezone.utc):
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Verification code has expired.",
                status_code=400,
            )

        # Success: Verify user and clear OTP
        was_verified = user.is_verified
        user.is_verified = True
        user.otp_code = None
        user.otp_expires_at = None
        await self.repo.db.flush()

        # Issue JWT tokens FIRST — emails are dispatched non-blocking after
        from app.services.email_service import EmailService
        email_service = EmailService()
        tokens = await self._generate_auth_tokens(user)

        user_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
        if not was_verified:
            # First-time verification: send welcome
            email_service.dispatch(
                background_tasks,
                email_service.send_welcome_email,
                user.email,
                user_name,
            )
        else:
            # Subsequent OTP: send login alert
            email_service.dispatch(
                background_tasks,
                email_service.send_login_alert_email,
                user.email,
                user_name,
                "Web Browser",
                "Detected Location",
                datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            )

        return tokens


    async def resend_otp(self, email: str, background_tasks: Optional[Any] = None) -> None:
        user = await self.repo.get_by_email(email)
        if not user:
            raise AppException(
                code=ErrorCode.USER_001,
                message="User not found.",
                status_code=404,
            )

        import secrets
        from app.services.email_service import EmailService

        otp = f"{secrets.randbelow(900000) + 100000}"
        user.otp_code = otp
        user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        await self.repo.db.flush()

        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_email_verification_email,
            user.email,
            otp,
        )

    async def request_password_reset(self, email: str, background_tasks: Optional[Any] = None) -> None:
        user = await self.repo.get_by_email(email)
        if not user:
            return

        import secrets
        from app.services.email_service import EmailService

        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        await self.repo.db.flush()

        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_password_reset_email,
            user.email,
            token,
        )

    async def reset_password(self, token: str, new_password: str, background_tasks: Optional[Any] = None) -> None:
        from sqlalchemy import select
        from app.models.user import User

        query = select(User).where(User.reset_token == token, User.deleted_at.is_(None))
        result = await self.repo.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Invalid or expired reset token.",
                status_code=400,
            )

        if not user.reset_expires_at or self._ensure_utc(user.reset_expires_at) < datetime.now(timezone.utc):
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Reset token has expired.",
                status_code=400,
            )

        user.hashed_password = hash_password(new_password)
        user.reset_token = None
        user.reset_expires_at = None
        await self.repo.db.flush()
        await self.repo.revoke_all_user_tokens(user.id)

        from app.services.email_service import EmailService
        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_password_changed_email,
            user.email,
            f"{user.first_name or ''} {user.last_name or ''}".strip(),
        )

    async def sign_in(self, request: SignInRequest, background_tasks: Optional[Any] = None) -> AuthTokenDTO:
        user = await self.repo.get_by_email(request.email)
        if not user:
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )

        locked_until = self._ensure_utc(user.locked_until)
        if locked_until and locked_until > datetime.now(timezone.utc):
            remaining_seconds = int((locked_until - datetime.now(timezone.utc)).total_seconds())
            raise AppException(
                code=ErrorCode.AUTH_003,
                message=f"Account locked due to multiple failed login attempts. Try again in {remaining_seconds // 60 + 1} minutes.",
                status_code=423,
            )

        if not verify_password(request.password, user.hashed_password):
            await self.repo.increment_failed_logins(user)
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )

        await self.repo.reset_failed_logins(user)

        import secrets
        from app.services.email_service import EmailService

        otp = f"{secrets.randbelow(900000) + 100000}"
        user.otp_code = otp
        user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        await self.repo.db.flush()

        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_two_factor_code_email,
            user.email,
            otp,
        )

        return AuthTokenDTO(
            requires_2fa=True,
            email=user.email
        )


    async def refresh_tokens(self, request: RefreshTokenRequest) -> AuthTokenDTO:
        token_h = hash_token(request.refresh_token)
        token_entry = await self.repo.get_refresh_token(token_h)

        if not token_entry or self._ensure_utc(token_entry.expires_at) < datetime.now(timezone.utc):
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

    async def update_user_preference(self, user_id: UUID, pref_data: dict) -> UserDTO:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        await self.repo.update_user_preference(user_id, pref_data)
        updated_user = await self.repo.get_by_id(user_id)
        return UserDTO.model_validate(updated_user)

    async def change_password(self, user_id: UUID, current_pass: str, new_pass: str) -> None:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        if not verify_password(current_pass, user.hashed_password):
            raise AppException(code=ErrorCode.AUTH_001, message="Current password is incorrect.", status_code=400)

        user.hashed_password = hash_password(new_pass)
        await self.repo.db.flush()
        await self.repo.revoke_all_user_tokens(user_id)

    async def delete_account(self, user_id: UUID) -> None:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        email = user.email
        first_name = user.first_name

        await self.repo.hard_delete_user_data(user_id)

        from app.services.email_service import EmailService
        email_service = EmailService()
        email_service.dispatch(
            email_service.send_account_deleted_email(email, first_name or "User", settings.EMAIL_SUPPORT_URL)
        )

    async def get_user_sessions(self, user_id: UUID) -> list:
        from app.dto.user import UserSessionDTO
        sessions = await self.repo.get_active_user_sessions(user_id)
        return [UserSessionDTO.model_validate(s) for s in sessions]

    async def revoke_user_session(self, user_id: UUID, session_id: UUID) -> None:
        await self.repo.revoke_user_session_by_id(user_id, session_id)

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

