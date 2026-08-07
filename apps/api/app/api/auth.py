from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.auth import AuthTokenDTO, RefreshTokenRequest, SignInRequest, SignUpRequest
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import UserDTO
from app.middleware.auth import get_current_user
from app.middleware.rate_limiter import RateLimiter
from app.models.user import User
from app.services.auth_service import AuthService

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
