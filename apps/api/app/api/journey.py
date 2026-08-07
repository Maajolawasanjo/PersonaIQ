from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dto.common import PaginatedResponse, PaginationMeta, ResponseMeta, StandardResponse
from app.dto.journey import CreateJourneyRequest, JourneyDTO, UpdateEventRequest
from app.dto.presence import PresencePlanDTO
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.journey_service import JourneyService
from app.services.presence_service import PresenceService

router = APIRouter(prefix="/journeys", tags=["Presence Journeys"])


@router.post(
    "",
    response_model=StandardResponse[JourneyDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Initiate New Presence Journey",
)
async def create_journey(
    request_data: CreateJourneyRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_create_journey")
    service = JourneyService(db)
    journey = await service.create_journey(current_user.id, request_data)

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Presence journey initiated successfully.",
        data=journey,
        meta=meta,
    )


@router.get(
    "",
    response_model=PaginatedResponse[JourneyDTO],
    status_code=status.HTTP_200_OK,
    summary="List User Presence Journeys (Paginated)",
)
async def list_journeys(
    request: Request,
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by DRAFT, COMPLETED, ARCHIVED"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_list_journeys")
    service = JourneyService(db)
    items, total_items = await service.list_user_journeys(
        user_id=current_user.id,
        status_filter=status_filter,
        page=page,
        page_size=page_size,
    )

    total_pages = (total_items + page_size - 1) // page_size if total_items > 0 else 0
    pagination = PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
    )
    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )

    return PaginatedResponse(
        success=True,
        message="Journeys retrieved successfully.",
        data=items,
        pagination=pagination,
        meta=meta,
    )


@router.get(
    "/{journey_id}",
    response_model=StandardResponse[JourneyDTO],
    status_code=status.HTTP_200_OK,
    summary="Get Presence Journey Details",
)
async def get_journey(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", f"req_journey_{journey_id}")
    service = JourneyService(db)
    journey = await service.get_journey(journey_id, current_user.id)

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Journey details retrieved.",
        data=journey,
        meta=meta,
    )


@router.patch(
    "/{journey_id}/event",
    response_model=StandardResponse[JourneyDTO],
    status_code=status.HTTP_200_OK,
    summary="Update Event Context & Dress Code",
)
async def update_event_context(
    journey_id: UUID,
    request_data: UpdateEventRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", f"req_update_event_{journey_id}")
    correlation_id = getattr(request.state, "correlation_id", None)
    service = JourneyService(db)
    journey = await service.update_event_context(
        journey_id=journey_id,
        user_id=current_user.id,
        request=request_data,
        correlation_id=correlation_id,
    )

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Event context updated successfully.",
        data=journey,
        meta=meta,
    )


@router.post(
    "/{journey_id}/analyze",
    response_model=StandardResponse[PresencePlanDTO],
    status_code=status.HTTP_200_OK,
    summary="Trigger AI Analysis & Generate Presence Plan",
)
async def analyze_journey(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", f"req_analyze_{journey_id}")
    correlation_id = getattr(request.state, "correlation_id", None)

    service = PresenceService(db)
    plan = await service.run_ai_analysis(
        journey_id=journey_id,
        user_id=current_user.id,
        correlation_id=correlation_id,
    )

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="AI analysis completed and Presence Plan generated.",
        data=plan,
        meta=meta,
    )


@router.get(
    "/{journey_id}/plan",
    response_model=StandardResponse[PresencePlanDTO],
    status_code=status.HTTP_200_OK,
    summary="Get Generated Presence Plan",
)
async def get_presence_plan(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", f"req_plan_{journey_id}")
    service = PresenceService(db)
    plan = await service.get_presence_plan(journey_id=journey_id, user_id=current_user.id)

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Presence plan retrieved.",
        data=plan,
        meta=meta,
    )


@router.post(
    "/{journey_id}/archive",
    response_model=StandardResponse[JourneyDTO],
    status_code=status.HTTP_200_OK,
    summary="Archive Journey",
)
async def archive_journey(
    journey_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", f"req_archive_{journey_id}")
    service = JourneyService(db)
    journey = await service.archive_journey(journey_id=journey_id, user_id=current_user.id)

    meta = ResponseMeta(
        request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat()
    )
    return StandardResponse(
        success=True,
        message="Journey archived successfully.",
        data=journey,
        meta=meta,
    )
