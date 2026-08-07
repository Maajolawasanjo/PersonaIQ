from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dto.dashboard import DashboardOverviewDTO
from app.dto.journey import JourneyDTO
from app.dto.presence import PresencePlanDTO
from app.models.journey import Journey
from app.models.presence import PresencePlan
from app.repositories.journey_repository import JourneyRepository
from app.repositories.presence_repository import PresenceRepository


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.journey_repo = JourneyRepository(db)
        self.presence_repo = PresenceRepository(db)

    async def get_dashboard_overview(self, user_id: UUID) -> DashboardOverviewDTO:
        # 1. Fetch Active Journey
        active_journey = await self.journey_repo.get_active_journey(user_id)
        active_dto = JourneyDTO.model_validate(active_journey) if active_journey else None

        # 2. Count Completed & Total Journeys
        total_query = select(func.count(Journey.id)).where(
            Journey.user_id == user_id, Journey.deleted_at.is_(None)
        )
        total_res = await self.db.execute(total_query)
        total_count = total_res.scalar_one() or 0

        completed_query = select(func.count(Journey.id)).where(
            Journey.user_id == user_id,
            Journey.status == "COMPLETED",
            Journey.deleted_at.is_(None),
        )
        completed_res = await self.db.execute(completed_query)
        completed_count = completed_res.scalar_one() or 0

        # 3. Calculate Average Presence Index
        avg_query = select(func.avg(Journey.active_presence_index)).where(
            Journey.user_id == user_id,
            Journey.status == "COMPLETED",
            Journey.deleted_at.is_(None),
        )
        avg_res = await self.db.execute(avg_query)
        avg_score_raw = avg_res.scalar_one()
        presence_avg = round(float(avg_score_raw), 1) if avg_score_raw is not None else 0.0

        # 4. Fetch Recent Plans
        recent_plans_query = (
            select(PresencePlan)
            .join(Journey)
            .where(Journey.user_id == user_id, Journey.deleted_at.is_(None))
            .order_by(PresencePlan.created_at.desc())
            .limit(3)
        )
        recent_plans_res = await self.db.execute(recent_plans_query)
        recent_plans = [
            PresencePlanDTO.model_validate(plan)
            for plan in recent_plans_res.scalars().all()
        ]

        quick_stats = {
            "status_summary": "Active Preparation" if active_journey else "Ready for New Journey",
            "trend": "+4% Presence Index Improvement" if completed_count > 0 else "Baseline Pending",
        }

        return DashboardOverviewDTO(
            active_journey=active_dto,
            presence_index_avg=presence_avg,
            completed_journeys_count=completed_count,
            total_journeys_count=total_count,
            recent_plans=recent_plans,
            quick_stats=quick_stats,
        )
