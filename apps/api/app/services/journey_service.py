from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.errors import AppException, ErrorCode
from app.dto.journey import CreateJourneyRequest, JourneyDTO, UpdateEventRequest
from app.repositories.journey_repository import JourneyRepository


class JourneyService:
    def __init__(self, db: AsyncSession):
        self.repo = JourneyRepository(db)

    async def create_journey(
        self, user_id: UUID, request: CreateJourneyRequest
    ) -> JourneyDTO:
        journey = await self.repo.create_journey(
            user_id=user_id, title=request.title
        )
        return JourneyDTO.model_validate(journey)

    async def get_journey(self, journey_id: UUID, user_id: UUID) -> JourneyDTO:
        journey = await self.repo.get_by_id(journey_id=journey_id, user_id=user_id)
        if not journey:
            raise AppException(
                code=ErrorCode.JOURNEY_001,
                message="Journey not found or access denied.",
                status_code=404,
            )
        return JourneyDTO.model_validate(journey)

    async def update_event_context(
        self,
        journey_id: UUID,
        user_id: UUID,
        request: UpdateEventRequest,
        correlation_id: Optional[str] = None,
    ) -> JourneyDTO:
        journey = await self.repo.get_by_id(journey_id=journey_id, user_id=user_id)
        if not journey:
            raise AppException(
                code=ErrorCode.JOURNEY_001,
                message="Journey not found or access denied.",
                status_code=404,
            )

        updated_journey = await self.repo.update_event_context(
            journey=journey, request=request, correlation_id=correlation_id
        )
        return JourneyDTO.model_validate(updated_journey)

    async def list_user_journeys(
        self,
        user_id: UUID,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[JourneyDTO], int]:
        journeys, total_items = await self.repo.list_user_journeys(
            user_id=user_id,
            status_filter=status_filter,
            page=page,
            page_size=page_size,
        )
        dtos = [JourneyDTO.model_validate(j) for j in journeys]
        return dtos, total_items

    async def archive_journey(self, journey_id: UUID, user_id: UUID) -> JourneyDTO:
        journey = await self.repo.get_by_id(journey_id=journey_id, user_id=user_id)
        if not journey:
            raise AppException(
                code=ErrorCode.JOURNEY_001,
                message="Journey not found or access denied.",
                status_code=404,
            )
        archived = await self.repo.archive_journey(journey)
        return JourneyDTO.model_validate(archived)
