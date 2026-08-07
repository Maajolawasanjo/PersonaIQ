from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import OnboardingRequest, UpdateProfileRequest, UserDTO
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.email_service import EmailService
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/profile", tags=["User Profile"])


@router.get(
    "",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Get User Profile",
)
async def get_profile(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    request_id = getattr(request.state, "request_id", "req_profile")
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Profile details fetched.",
        data=UserDTO.model_validate(current_user),
        meta=meta,
    )


@router.patch(
    "",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Update User Profile",
)
async def update_profile(
    request_data: UpdateProfileRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_update_profile")
    service = AuthService(db)
    updated_user = await service.update_profile(current_user.id, request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Profile updated successfully.",
        data=updated_user,
        meta=meta,
    )


@router.patch(
    "/onboarding",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Complete Profile Onboarding",
)
async def complete_onboarding(
    request_data: OnboardingRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "req_onboarding", "req_onboarding")
    service = AuthService(db)
    updated_user = await service.complete_onboarding(current_user.id, request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Onboarding completed successfully.",
        data=updated_user,
        meta=meta,
    )


class ChangeEmailRequest(BaseModel):
    new_email: EmailStr


class ConfirmEmailChangeRequest(BaseModel):
    code: str


@router.patch(
    "/email",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Request Email Address Change",
)
async def request_email_change(
    request_data: ChangeEmailRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generates a 6-digit OTP and sends verify-new-email.html to the new address."""
    import secrets
    from datetime import timedelta, timezone
    from app.core.errors import AppException, ErrorCode
    from app.repositories.user_repository import UserRepository

    request_id = getattr(request.state, "request_id", "req_change_email")
    repo = UserRepository(db)

    # Prevent duplicate email
    existing = await repo.get_by_email(str(request_data.new_email))
    if existing and existing.id != current_user.id:
        raise AppException(
            code=ErrorCode.USER_002,
            message="This email address is already in use.",
            status_code=400,
        )

    otp = f"{secrets.randbelow(900000) + 100000}"
    current_user.pending_email = str(request_data.new_email)
    current_user.otp_code = otp
    current_user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    await db.flush()

    # Non-fatal: OTP is already saved in DB; SMTP failure is logged but does not 500
    try:
        email_service = EmailService()
        await email_service.send_verify_new_email(
            to_email=str(request_data.new_email),
            code=otp,
            new_email=str(request_data.new_email),
        )
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(
            f"[request_email_change] Failed to send verify-new-email to {request_data.new_email}: {e}"
        )

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="A verification code has been sent to your new email address.",
        data={},
        meta=meta,
    )


@router.patch(
    "/email/confirm",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Confirm Email Address Change via OTP",
)
async def confirm_email_change(
    request_data: ConfirmEmailChangeRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Validates OTP and switches the user's email to the pending_email."""
    from datetime import timezone
    from app.core.errors import AppException, ErrorCode

    request_id = getattr(request.state, "request_id", "req_confirm_email")

    if not current_user.otp_code or current_user.otp_code != request_data.code:
        raise AppException(
            code=ErrorCode.AUTH_001,
            message="Invalid verification code.",
            status_code=400,
        )

    if not current_user.otp_expires_at or current_user.otp_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Verification code has expired.",
            status_code=400,
        )

    if not current_user.pending_email:
        raise AppException(
            code=ErrorCode.USER_001,
            message="No pending email change found.",
            status_code=400,
        )

    current_user.email = current_user.pending_email
    current_user.pending_email = None
    current_user.otp_code = None
    current_user.otp_expires_at = None
    await db.flush()

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Email address updated successfully.",
        data=UserDTO.model_validate(current_user),
        meta=meta,
    )
