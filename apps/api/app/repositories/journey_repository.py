from typing import Optional, List, Tuple, Any
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.journey import Journey, Event, JourneyEventLog
from app.repositories.base import BaseRepository

class JourneyRepository(BaseRepository[Journey]):
    def __init__(self, db: AsyncSession):
        super().__init__(Journey, db)

    async def create_journey(self, user_id: UUID, title: str) -> Journey:
        journey = Journey(user_id=user_id, title=title, status="DRAFT", current_step=1)
        self.db.add(journey)
        await self.db.flush()

        event = Event(journey_id=journey.id, name=title, importance=3)
        self.db.add(event)

        log = JourneyEventLog(
            journey_id=journey.id,
            event_type="JOURNEY_CREATED",
            payload={"title": title},
        )
        self.db.add(log)
        await self.db.flush()

        return await self.get_by_id(journey.id, user_id)

    async def get_by_id(self, journey_id: UUID, user_id: Optional[UUID] = None) -> Optional[Journey]:
        query = select(Journey).options(selectinload(Journey.event)).where(Journey.id == journey_id)
        if user_id:
            query = query.where(Journey.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_active_journey(self, user_id: UUID) -> Optional[Journey]:
        query = (
            select(Journey)
            .options(selectinload(Journey.event))
            .where(Journey.user_id == user_id, Journey.status != "ARCHIVED", Journey.status != "COMPLETED")
            .order_by(Journey.updated_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def update_event_context(self, journey: Journey, request: Any, correlation_id: Optional[str] = None) -> Journey:
        if not journey.event:
            journey.event = Event(journey_id=journey.id)

        if hasattr(request, "name") and request.name:
            journey.event.name = request.name
        if hasattr(request, "industry") and request.industry is not None:
            journey.event.industry = request.industry
        if hasattr(request, "location") and request.location is not None:
            journey.event.location = request.location
        if hasattr(request, "event_date") and request.event_date is not None:
            journey.event.event_date = request.event_date
        if hasattr(request, "event_time") and request.event_time is not None:
            journey.event.event_time = request.event_time
        if hasattr(request, "dress_code") and request.dress_code is not None:
            journey.event.dress_code = request.dress_code
        if hasattr(request, "importance") and request.importance is not None:
            journey.event.importance = request.importance

        journey.current_step = max(journey.current_step, 2)
        journey.updated_at = datetime.now(timezone.utc)
        await self.db.flush()
        return journey

    async def list_user_journeys(
        self,
        user_id: UUID,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 10
    ) -> Tuple[List[Journey], int]:
        query = select(Journey).options(selectinload(Journey.event)).where(Journey.user_id == user_id)
        if status_filter:
            query = query.where(Journey.status == status_filter)

        count_query = select(func.count()).select_from(query.subquery())
        count_res = await self.db.execute(count_query)
        total_items = count_res.scalar() or 0

        query = query.order_by(Journey.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total_items

    async def archive_journey(self, journey: Journey) -> Journey:
        journey.status = "ARCHIVED"
        journey.updated_at = datetime.now(timezone.utc)
        await self.db.flush()
        return journey
