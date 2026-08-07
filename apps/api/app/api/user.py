from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import OnboardingRequest, UpdateProfileRequest, UserDTO, UpdatePreferenceRequest, ChangePasswordRequest, UserSessionDTO
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


@router.patch(
    "/preferences",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Update User Preferences (Theme, Notifications, Event Type)",
)
async def update_preferences(
    request_data: UpdatePreferenceRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_update_preferences")
    service = AuthService(db)
    pref_data = request_data.model_dump(exclude_unset=True)
    updated_user = await service.update_user_preference(current_user.id, pref_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="User preferences updated successfully.",
        data=updated_user,
        meta=meta,
    )


@router.post(
    "/change-password",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Change Authenticated User Password",
)
async def change_password(
    request_data: ChangePasswordRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_change_password")
    service = AuthService(db)
    await service.change_password(
        user_id=current_user.id,
        current_pass=request_data.current_password,
        new_pass=request_data.new_password,
    )

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Password changed successfully. Please log in again.",
        data={},
        meta=meta,
    )


@router.delete(
    "/account",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Permanently Delete User Account & Purge Data",
)
async def delete_account(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_delete_account")
    service = AuthService(db)
    await service.delete_account(current_user.id)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Account permanently deleted.",
        data={"deleted": True},
        meta=meta,
    )


@router.get(
    "/sessions",
    response_model=StandardResponse[list[UserSessionDTO]],
    status_code=status.HTTP_200_OK,
    summary="List Active User Device Sessions",
)
async def list_active_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_list_sessions")
    service = AuthService(db)
    sessions = await service.get_user_sessions(current_user.id)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Active sessions retrieved successfully.",
        data=sessions,
        meta=meta,
    )


@router.delete(
    "/sessions/{session_id}",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Revoke Specific Device Session",
)
async def revoke_session(
    session_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_revoke_session")
    service = AuthService(db)
    await service.revoke_user_session(current_user.id, session_id)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Session revoked successfully.",
        data={"revoked": True},
        meta=meta,
    )


