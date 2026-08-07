from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.dto.user import OnboardingRequest, UpdateProfileRequest, UserDTO
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.auth_service import AuthService

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
    request_id = getattr(request.state, "request_id", "req_onboarding")
    service = AuthService(db)
    updated_user = await service.complete_onboarding(current_user.id, request_data)

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(
        success=True,
        message="Onboarding completed successfully.",
        data=updated_user,
        meta=meta,
    )
