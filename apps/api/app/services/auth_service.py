from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import secrets
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
from app.dto.auth import AuthTokenDTO, RefreshTokenRequest, SignInRequest, SignUpRequest, RegistrationResultDTO
from app.dto.user import OnboardingRequest, UpdateProfileRequest, UserDTO
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    def _ensure_utc(self, dt: Optional[datetime]) -> Optional[datetime]:
        if not dt:
            return None
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt

    @staticmethod
    def _otp_digest(email: str, code: str) -> str:
        # Existing OTP column is varchar(10). Use a keyed, constant-time
        # comparison and rate limiting; never store the plain verification code.
        payload = f"verify-email:{email.lower().strip()}:{code}".encode()
        return hmac.new(
            settings.SECRET_KEY.encode(), payload, hashlib.sha256
        ).hexdigest()[:10]

    async def sign_up(self, request: SignUpRequest, background_tasks: Optional[Any] = None) -> RegistrationResultDTO:
        existing = await self.repo.get_by_email(request.email)
        if existing:
            raise AppException(
                code=ErrorCode.USER_002,
                message="An account with this email address already exists.",
                status_code=400,
            )
        code = f"{secrets.randbelow(1000000):06d}"
        user = await self.repo.create(
            email=request.email.lower().strip(),
            hashed_password=hash_password(request.password),
            first_name=request.first_name.strip(),
            last_name=request.last_name.strip(),
        )
        user.is_verified = False
        user.otp_code = self._otp_digest(user.email, code)
        user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

        # Fail closed if production mail is disabled or unconfigured.
        if settings.ENVIRONMENT.lower() in {"production", "prod"} and (
            not settings.ENABLE_EMAIL_NOTIFICATIONS
            or not settings.SMTP_USER
            or not settings.SMTP_PASSWORD
        ):
            raise AppException(
                code=ErrorCode.SYS_002,
                message="Email verification is not configured. Registration is unavailable.",
                status_code=503,
            )

        # A successful response must not promise delivery when email is
        # unavailable. The transaction rolls back if delivery fails.
        from app.services.email_service import EmailService
        delivered = await EmailService().send_email_verification_email(user.email, code)
        if not delivered:
            raise AppException(
                code=ErrorCode.SYS_002,
                message="Email verification is currently unavailable. Please try again later.",
                status_code=503,
            )
        return RegistrationResultDTO(email=user.email)

    async def verify_otp(self, email: str, code: str) -> AuthTokenDTO:
        user = await self.repo.get_by_email(email)
        now = datetime.now(timezone.utc)
        if not user or user.is_verified or not user.is_active or user.deleted_at:
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Verification code is invalid or expired.",
                status_code=400,
            )
        lock = self._ensure_utc(user.locked_until)
        if lock and lock > now:
            raise AppException(
                code=ErrorCode.AUTH_003,
                message="Too many attempts. Try again later.",
                status_code=429,
            )
        valid = (
            user.otp_code
            and user.otp_expires_at
            and self._ensure_utc(user.otp_expires_at) > now
            and hmac.compare_digest(
                user.otp_code, self._otp_digest(user.email, code)
            )
        )
        if not valid:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.locked_until = now + timedelta(minutes=10)
            await self.repo.db.commit()
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Verification code is invalid or expired.",
                status_code=400,
            )
        user.is_verified = True
        user.otp_code = None
        user.otp_expires_at = None
        user.failed_login_attempts = 0
        user.locked_until = None
        return await self._generate_auth_tokens(user)

    async def resend_otp(self, email: str) -> None:
        user = await self.repo.get_by_email(email)
        if not user or user.is_verified or not user.is_active or user.deleted_at:
            return
        now = datetime.now(timezone.utc)
        locked_until = self._ensure_utc(user.locked_until)
        if locked_until and locked_until > now:
            return
        # Reissuing earlier than 60 seconds would let attackers rotate
        # the verification challenge and spam a recipient.
        expires = self._ensure_utc(user.otp_expires_at)
        if expires and expires > now + timedelta(minutes=9):
            return
        if settings.ENVIRONMENT.lower() in {"production", "prod"} and (
            not settings.ENABLE_EMAIL_NOTIFICATIONS
            or not settings.SMTP_USER
            or not settings.SMTP_PASSWORD
        ):
            raise AppException(
                code=ErrorCode.SYS_002,
                message="Email verification is not configured.",
                status_code=503,
            )
        code = f"{secrets.randbelow(1000000):06d}"
        from app.services.email_service import EmailService
        sent = await EmailService().send_email_verification_email(user.email, code)
        if not sent:
            raise AppException(
                code=ErrorCode.SYS_002,
                message="Email verification is temporarily unavailable.",
                status_code=503,
            )
        user.otp_code = self._otp_digest(user.email, code)
        user.otp_expires_at = now + timedelta(minutes=10)
        user.failed_login_attempts = 0

    async def request_password_reset(self, email: str, background_tasks: Optional[Any] = None) -> None:
        user = await self.repo.get_by_email(email)
        if not user:
            return

        import secrets
        from app.services.email_service import EmailService

        token = secrets.token_urlsafe(32)
        user.reset_token = hash_token(token)
        user.reset_expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        await self.repo.db.commit()

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

        query = select(User).where(User.reset_token == hash_token(token), User.deleted_at.is_(None))
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
        await self.repo.revoke_all_user_tokens(user.id)
        await self.repo.db.commit()

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
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=10)
            await self.repo.db.commit()
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )

        if not user.is_active or user.deleted_at:
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Invalid email or password.",
                status_code=401,
            )
        if not user.is_verified:
            raise AppException(
                code=ErrorCode.AUTH_005,
                message="Please verify your email before signing in.",
                status_code=403,
            )
        await self.repo.reset_failed_logins(user)
        await self.repo.db.commit()

        from app.services.email_service import EmailService
        email_service = EmailService()
        email_service.dispatch(
            background_tasks,
            email_service.send_login_alert_email,
            user.email,
            f"{user.first_name or ''} {user.last_name or ''}".strip(),
            "Web Browser",
            "Detected Location",
            datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        )

        return await self._generate_auth_tokens(user)


    async def refresh_tokens(self, request: RefreshTokenRequest) -> AuthTokenDTO:
        token_h = hash_token(request.refresh_token)
        token_entry = await self.repo.get_refresh_token(token_h)

        if not token_entry or self._ensure_utc(token_entry.expires_at) < datetime.now(timezone.utc):
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Refresh token is invalid or expired.",
                status_code=401,
            )

        user = token_entry.user
        if not user.is_active or not user.is_verified or user.deleted_at:
            raise AppException(
                code=ErrorCode.AUTH_002,
                message="Session is no longer active.",
                status_code=401,
            )
        # Rotate only after validating account status.
        await self.repo.revoke_refresh_token(token_h)
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

        if request.default_event_type:
            await self.repo.update_user_preference(
                user_id,
                {"default_event_type": request.default_event_type},
            )
            await self.repo.db.refresh(user, attribute_names=["preference"])

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

    async def delete_account(self, user_id: UUID, current_password: str) -> None:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise AppException(code=ErrorCode.USER_001, message="User not found.", status_code=404)

        if not verify_password(current_password, user.hashed_password):
            raise AppException(
                code=ErrorCode.AUTH_001,
                message="Current password is incorrect.",
                status_code=400,
            )

        email = user.email
        first_name = user.first_name

        # Removing a database row never removes its stored object. Purge
        # owned media first, otherwise preserve the account for retry.
        from app.services.storage_service import StorageService
        media_refs = await self.repo.list_user_media_references(user_id)
        await StorageService().delete_owned_uploads(media_refs, str(user_id))
        await self.repo.hard_delete_user_data(user_id)

        from app.services.email_service import EmailService
        email_service = EmailService()
        email_service.dispatch(
            None,
            email_service.send_account_deleted_email,
            email,
            first_name or "User",
            settings.EMAIL_SUPPORT_URL,
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

