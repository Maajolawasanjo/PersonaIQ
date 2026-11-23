from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.auth import (
    AuthTokenDTO,
    RegistrationResultDTO,
    VerifyEmailRequest,
    ResendVerificationRequest,
    RefreshTokenRequest,
    SignInRequest,
    SignUpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import UserDTO, UpdateProfileRequest
from app.middleware.auth import get_current_user
from app.middleware.rate_limiter import RateLimiter
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.email_service import EmailService


router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_limiter = RateLimiter(max_requests=20, window_seconds=60)


@router.post(
    "/sign-up",
    response_model=StandardResponse[RegistrationResultDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    dependencies=[Depends(auth_limiter)],
)
async def sign_up(
    request_data: SignUpRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_signup")
    service = AuthService(db)
    registration = await service.sign_up(request_data, background_tasks=background_tasks)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Account created. Check your email for your six-digit verification code.",
        data=registration,
        meta=meta,
    )


@router.post(
    "/verify-otp",
    response_model=StandardResponse[AuthTokenDTO],
    status_code=status.HTTP_200_OK,
    summary="Verify Email and Start Session",
    dependencies=[Depends(auth_limiter)],
)
async def verify_otp(
    request_data: VerifyEmailRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    tokens = await AuthService(db).verify_otp(request_data.email, request_data.code)
    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_verify_email"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(
        success=True, message="Email verified successfully.",
        data=tokens, meta=meta,
    )


@router.post(
    "/resend-otp",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Request Another Verification Code",
    dependencies=[Depends(auth_limiter)],
)
async def resend_otp(
    request_data: ResendVerificationRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await AuthService(db).resend_otp(request_data.email)
    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_resend_email"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(
        success=True,
        message="If an unverified account exists, we will send another code when eligible.",
        data={"requested": True}, meta=meta,
    )


@router.post(
    "/sign-in",
    response_model=StandardResponse[AuthTokenDTO],
    status_code=status.HTTP_200_OK,
    summary="Authenticate User & Issue JWT Tokens",
    dependencies=[Depends(auth_limiter)],
)
async def sign_in(
    request_data: SignInRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_signin")
    service = AuthService(db)
    tokens = await service.sign_in(request_data, background_tasks=background_tasks)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Authentication successful.",
        data=tokens,
        meta=meta,
    )


@router.post(
    "/refresh",
    response_model=StandardResponse[AuthTokenDTO],
    status_code=status.HTTP_200_OK,
    summary="Rotate & Issue New Access Token",
)
async def refresh_tokens(
    request_data: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_refresh")
    service = AuthService(db)
    tokens = await service.refresh_tokens(request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Tokens refreshed successfully.",
        data=tokens,
        meta=meta,
    )




@router.post(
    "/forgot-password",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Request Password Reset Link",
    dependencies=[Depends(auth_limiter)],
)
async def forgot_password(
    request_data: ForgotPasswordRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_forgot_pw")
    service = AuthService(db)
    await service.request_password_reset(request_data.email, background_tasks=background_tasks)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="If the email exists, a password reset link has been sent.",
        data={},
        meta=meta,
    )


@router.post(
    "/reset-password",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Reset User Password using Token",
    dependencies=[Depends(auth_limiter)],
)
async def reset_password(
    request_data: ResetPasswordRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_reset_pw")
    service = AuthService(db)
    await service.reset_password(request_data.token, request_data.new_password, background_tasks=background_tasks)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Password has been reset successfully.",
        data={},
        meta=meta,
    )



@router.post(
    "/logout",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Revoke Refresh Token & Logout",
)
async def logout(
    request_data: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_logout")
    service = AuthService(db)
    await service.logout(request_data.refresh_token)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Logout successful.",
        data={"logged_out": True},
        meta=meta,
    )


@router.get(
    "/me",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User Profile",
)
async def get_me(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    request_id = getattr(request.state, "request_id", "req_me")
    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="User profile retrieved.",
        data=UserDTO.model_validate(current_user),
        meta=meta,
    )


@router.patch(
    "/profile",
    response_model=StandardResponse[UserDTO],
    status_code=status.HTTP_200_OK,
    summary="Update Authenticated User Profile",
)
async def update_profile(
    request_data: UpdateProfileRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_update_profile")
    service = AuthService(db)
    user_dto = await service.update_profile(current_user.id, request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="User profile updated successfully.",
        data=user_dto,
        meta=meta,
    )
