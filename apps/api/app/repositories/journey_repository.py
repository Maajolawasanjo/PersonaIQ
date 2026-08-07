from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.dto.journey import UpdateEventRequest
from app.models.journey import Event, Journey, JourneyEventLog


class JourneyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, journey_id: UUID, user_id: UUID) -> Optional[Journey]:
        query = (
            select(Journey)
            .options(selectinload(Journey.event))
            .where(
                Journey.id == journey_id,
                Journey.user_id == user_id,
                Journey.deleted_at.is_(None),
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_journey(self, user_id: UUID, title: str) -> Journey:
        journey = Journey(
            user_id=user_id,
            title=title,
            status="DRAFT",
            current_step=1,
        )
        self.db.add(journey)
        await self.db.flush()

        event = Event(journey_id=journey.id, name=title)
        self.db.add(event)

        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="JOURNEY_CREATED",
            payload={"title": title, "status": "DRAFT"},
        )
        self.db.add(log_entry)
        await self.db.flush()

        journey.event = event
        return journey

    async def update_event_context(
        self, journey: Journey, request: UpdateEventRequest, correlation_id: Optional[str] = None
    ) -> Journey:
        if not journey.event:
            journey.event = Event(journey_id=journey.id)
            self.db.add(journey.event)
            await self.db.flush()

        if request.name is not None:
            journey.event.name = request.name
        if request.industry is not None:
            journey.event.industry = request.industry
        if request.location is not None:
            journey.event.location = request.location
        if request.event_date is not None:
            journey.event.event_date = request.event_date
        if request.event_time is not None:
            journey.event.event_time = request.event_time
        if request.dress_code is not None:
            journey.event.dress_code = request.dress_code
        if request.importance is not None:
            journey.event.importance = request.importance

        # Step Progression
        if journey.current_step == 1:
            journey.current_step = 2

        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="EVENT_CONTEXT_UPDATED",
            payload=request.model_dump(exclude_unset=True),
            correlation_id=correlation_id,
        )
        self.db.add(log_entry)
        await self.db.flush()

        return journey

    async def list_user_journeys(
        self,
        user_id: UUID,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[Journey], int]:
        base_where = [Journey.user_id == user_id, Journey.deleted_at.is_(None)]
        if status_filter:
            base_where.append(Journey.status == status_filter.upper())

        count_query = select(func.count(Journey.id)).where(*base_where)
        count_res = await self.db.execute(count_query)
        total_items = count_res.scalar_one() or 0

        query = (
            select(Journey)
            .options(selectinload(Journey.event))
            .where(*base_where)
            .order_by(Journey.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        result = await self.db.execute(query)
        journeys = list(result.scalars().all())

        return journeys, total_items

    async def archive_journey(self, journey: Journey) -> Journey:
        journey.status = "ARCHIVED"
        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="JOURNEY_ARCHIVED",
            payload={"status": "ARCHIVED"},
        )
        self.db.add(log_entry)
        await self.db.flush()
        return journey

    async def get_active_journey(self, user_id: UUID) -> Optional[Journey]:
        """Returns in-progress DRAFT journey or most recent completed journey."""
        query = (
            select(Journey)
            .options(selectinload(Journey.event))
            .where(
                Journey.user_id == user_id,
                Journey.deleted_at.is_(None),
                Journey.status.in_(["DRAFT", "PROCESSING"]),
            )
            .order_by(Journey.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
