from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.auth import (
    AuthTokenDTO,
    RefreshTokenRequest,
    SignInRequest,
    SignUpRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import UserDTO
from app.middleware.auth import get_current_user
from app.middleware.rate_limiter import RateLimiter
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.email_service import EmailService


router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_limiter = RateLimiter(max_requests=20, window_seconds=60)


@router.post(
    "/sign-up",
    response_model=StandardResponse[AuthTokenDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    dependencies=[Depends(auth_limiter)],
)
async def sign_up(
    request_data: SignUpRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_signup")
    service = AuthService(db)
    tokens = await service.sign_up(request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="User account created successfully.",
        data=tokens,
        meta=meta,
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
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_signin")
    service = AuthService(db)
    tokens = await service.sign_in(request_data)

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
    "/verify-otp",
    response_model=StandardResponse[AuthTokenDTO],
    status_code=status.HTTP_200_OK,
    summary="Verify Email OTP Code",
    dependencies=[Depends(auth_limiter)],
)
async def verify_otp(
    request_data: VerifyOTPRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_verify_otp")
    service = AuthService(db)
    tokens = await service.verify_otp(request_data.email, request_data.code)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Email verified successfully.",
        data=tokens,
        meta=meta,
    )


@router.post(
    "/resend-otp",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Resend Email OTP Code",
    dependencies=[Depends(auth_limiter)],
)
async def resend_otp(
    request_data: ResendOTPRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_resend_otp")
    service = AuthService(db)
    await service.resend_otp(request_data.email)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Verification code resent successfully.",
        data={},
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
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_forgot_pw")
    service = AuthService(db)
    await service.request_password_reset(request_data.email)

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
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_reset_pw")
    service = AuthService(db)
    await service.reset_password(request_data.token, request_data.new_password)

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


@router.post(
    "/test-email",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Trigger and dispatch test transactional email templates",
)
async def test_email(
    to_email: str,
    template: str,  # "welcome", "email-verification", "verify-new-email", "password-reset", etc., or "all"
    request: Request,
):
    request_id = getattr(request.state, "request_id", "req_test_email")
    email_service = EmailService()

    templates = [
        "welcome",
        "email-verification",
        "verify-new-email",
        "password-reset",
        "password-changed",
        "login-alert",
        "analysis-started",
        "analysis-ready",
        "journey-reminder",
        "subscription-activated",
        "payment-receipt",
        "payment-failed",
        "subscription-cancelled",
        "trial-ending",
        "support-confirmation"
    ]

    sent_templates = []
    failed_templates = []

    async def dispatch(tpl: str):
        try:
            if tpl == "welcome":
                await email_service.send_welcome_email(to_email, "Test User")
            elif tpl == "email-verification":
                await email_service.send_email_verification_email(to_email, "123456")
            elif tpl == "verify-new-email":
                await email_service.send_verify_new_email(to_email, "654321", "new_email@example.com")
            elif tpl == "password-reset":
                await email_service.send_password_reset_email(to_email, "test-reset-token-123")
            elif tpl == "password-changed":
                await email_service.send_password_changed_email(to_email, "Test User")
            elif tpl == "login-alert":
                await email_service.send_login_alert_email(
                    to_email, "Test User", "Chrome on macOS", "San Francisco, US", "2026-08-07 13:00:00"
                )
            elif tpl == "analysis-started":
                await email_service.send_analysis_started_email(to_email, "Test User", "Important Vibe Check")
            elif tpl == "analysis-ready":
                await email_service.send_analysis_ready_email(
                    to_email, "Test User", "Important Vibe Check", 95, "http://localhost:3000/dashboard"
                )
            elif tpl == "journey-reminder":
                await email_service.send_journey_reminder_email(
                    to_email, "Test User", "Important Vibe Check", "3 days", "http://localhost:3000/dashboard"
                )
            elif tpl == "subscription-activated":
                await email_service.send_subscription_activated_email(
                    to_email, "Test User", "Executive Growth", "monthly", "$29.00"
                )
            elif tpl == "payment-receipt":
                await email_service.send_payment_receipt_email(
                    to_email, "Test User", "INV-8871", "$29.00", "Mastercard ending in 9988", "http://localhost:3000/receipts"
                )
            elif tpl == "payment-failed":
                await email_service.send_payment_failed_email(to_email, "Test User", "$29.00", "http://localhost:3000/billing")
            elif tpl == "subscription-cancelled":
                await email_service.send_subscription_cancelled_email(to_email, "Test User", "2026-09-07", "http://localhost:3000/billing")
            elif tpl == "trial-ending":
                await email_service.send_trial_ending_email(to_email, "Test User", 3, "http://localhost:3000/billing")
            elif tpl == "support-confirmation":
                await email_service.send_support_confirmation_email(
                    to_email, "Test User", "TKT-552", "Billing issue regarding my subscription."
                )
            sent_templates.append(tpl)
        except Exception as e:
            failed_templates.append({"template": tpl, "error": str(e)})

    if template == "all":
        for t in templates:
            await dispatch(t)
    elif template in templates:
        await dispatch(template)
    else:
        meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
        return StandardResponse(
            success=False,
            message=f"Invalid template type: {template}. Allowed: {templates} or 'all'",
            data={},
            meta=meta,
        )

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    if failed_templates:
        return StandardResponse(
            success=False,
            message="Some emails failed to dispatch.",
            data={"sent": sent_templates, "failed": failed_templates},
            meta=meta,
        )
    return StandardResponse(
        success=True,
        message=f"Emails dispatched successfully to {to_email}.",
        data={"sent": sent_templates},
        meta=meta,
    )

