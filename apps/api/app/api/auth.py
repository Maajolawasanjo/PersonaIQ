from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.auth import (
    AuthTokenDTO,
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
    response_model=StandardResponse[AuthTokenDTO],
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
    tokens = await service.sign_up(request_data, background_tasks=background_tasks)

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



@router.post(
    "/test-email",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Send test transactional emails (27 templates). Defaults to EMAIL_TEST_RECIPIENT in .env",
)
async def test_email(
    template: str,  # any template slug or "all"
    request: Request,
    to_email: Optional[str] = None,
):
    """Dispatch test emails to verify template rendering and SMTP delivery.

    - If `to_email` is omitted, uses EMAIL_TEST_RECIPIENT from .env
    - Use template="all" to fire all 27 templates in sequence
    """
    request_id = getattr(request.state, "request_id", "req_test_email")

    recipient = to_email or settings.EMAIL_TEST_RECIPIENT
    if not recipient:
        meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
        return StandardResponse(
            success=False,
            message="No recipient specified. Pass ?to_email=... or set EMAIL_TEST_RECIPIENT in .env",
            data={},
            meta=meta,
        )

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
        "support-confirmation",
        "account-deleted",
        "subscription-upgraded",
        "subscription-downgraded",
        "trial-started",
        "invoice-upcoming",
        "payment-method-updated",
        "data-export-ready",
        "reactivation",
        "inactivity-nudge",
        "referral-invite",
        "feedback-request",
        "two-factor-code",
    ]

    sent_templates = []
    failed_templates = []

    async def dispatch(tpl: str):
        try:
            if tpl == "welcome":
                await email_service.send_welcome_email(recipient, "Test User")
            elif tpl == "email-verification":
                await email_service.send_email_verification_email(recipient, "483920")
            elif tpl == "verify-new-email":
                await email_service.send_verify_new_email(recipient, "654321", "new_email@example.com")
            elif tpl == "password-reset":
                await email_service.send_password_reset_email(recipient, "test-reset-token-abc123")
            elif tpl == "password-changed":
                await email_service.send_password_changed_email(recipient, "Test User")
            elif tpl == "login-alert":
                await email_service.send_login_alert_email(
                    recipient, "Test User", "Chrome on macOS", "Lagos, NG", "2026-08-07 14:32:00 UTC"
                )
            elif tpl == "analysis-started":
                await email_service.send_analysis_started_email(recipient, "Test User", "Executive Board Pitch")
            elif tpl == "analysis-ready":
                await email_service.send_analysis_ready_email(
                    recipient, "Test User", "Executive Board Pitch", 92, "http://localhost:3000/dashboard"
                )
            elif tpl == "journey-reminder":
                await email_service.send_journey_reminder_email(
                    recipient, "Test User", "Executive Board Pitch", "3 days", "http://localhost:3000/dashboard"
                )
            elif tpl == "subscription-activated":
                await email_service.send_subscription_activated_email(
                    recipient, "Test User", "Executive Growth", "monthly", "$49.00"
                )
            elif tpl == "payment-receipt":
                await email_service.send_payment_receipt_email(
                    recipient, "Test User", "INV-8871", "$49.00", "Visa ending in 4242", "http://localhost:3000/receipts"
                )
            elif tpl == "payment-failed":
                await email_service.send_payment_failed_email(recipient, "Test User", "$49.00", "http://localhost:3000/billing")
            elif tpl == "subscription-cancelled":
                await email_service.send_subscription_cancelled_email(recipient, "Test User", "2026-09-07", "http://localhost:3000/billing")
            elif tpl == "trial-ending":
                await email_service.send_trial_ending_email(recipient, "Test User", 3, "http://localhost:3000/billing")
            elif tpl == "support-confirmation":
                await email_service.send_support_confirmation_email(
                    recipient, "Test User", "TKT-552", "Billing issue regarding my subscription."
                )
            elif tpl == "account-deleted":
                await email_service.send_account_deleted_email(
                    recipient, "Test User", settings.EMAIL_SUPPORT_URL
                )
            elif tpl == "subscription-upgraded":
                await email_service.send_subscription_upgraded_email(
                    recipient, "Test User", "Starter", "Executive Growth",
                    "monthly", "$49.00", "2026-09-07", "http://localhost:3000/dashboard"
                )
            elif tpl == "subscription-downgraded":
                await email_service.send_subscription_downgraded_email(
                    recipient, "Test User", "Executive Growth", "Starter",
                    "2026-09-07", "$19.00", "monthly", "http://localhost:3000/billing"
                )
            elif tpl == "trial-started":
                await email_service.send_trial_started_email(
                    recipient, "Test User", "Executive Growth", 14,
                    "2026-08-21", "http://localhost:3000/dashboard"
                )
            elif tpl == "invoice-upcoming":
                await email_service.send_invoice_upcoming_email(
                    recipient, "Test User", "Executive Growth", "$49.00",
                    "2026-09-07", "Visa ending in 4242", "http://localhost:3000/billing"
                )
            elif tpl == "payment-method-updated":
                await email_service.send_payment_method_updated_email(
                    recipient, "Test User", "Mastercard", "9988",
                    "2026-08-07 14:00 UTC", settings.EMAIL_SUPPORT_URL
                )
            elif tpl == "data-export-ready":
                await email_service.send_data_export_ready_email(
                    recipient, "Test User", "2026-08-07 10:00 UTC",
                    "2026-08-14 10:00 UTC", "http://localhost:3000/exports/download"
                )
            elif tpl == "reactivation":
                await email_service.send_reactivation_email(
                    recipient, "Test User", "http://localhost:3000/billing"
                )
            elif tpl == "inactivity-nudge":
                await email_service.send_inactivity_nudge_email(
                    recipient, "Test User", 30, "Executive Board Pitch", 2,
                    "http://localhost:3000/dashboard", "http://localhost:3000/unsubscribe"
                )
            elif tpl == "referral-invite":
                await email_service.send_referral_invite_email(
                    recipient, "Alex Johnson", "ALEX2026", "1 month free",
                    "http://localhost:3000/signup?ref=ALEX2026"
                )
            elif tpl == "feedback-request":
                await email_service.send_feedback_request_email(
                    recipient, "Test User", "Executive Board Pitch",
                    "http://localhost:3000/feedback?r=1",
                    "http://localhost:3000/feedback?r=2",
                    "http://localhost:3000/feedback?r=3",
                    "http://localhost:3000/feedback?r=4",
                    "http://localhost:3000/feedback?r=5",
                    "http://localhost:3000/feedback",
                    "http://localhost:3000/unsubscribe"
                )
            elif tpl == "two-factor-code":
                await email_service.send_two_factor_code_email(recipient, "847291")
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

