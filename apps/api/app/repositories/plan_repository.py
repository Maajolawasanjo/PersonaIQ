from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.presence_dna import PresenceGoal
from app.repositories.base import BaseRepository

class PlanRepository(BaseRepository[PresenceGoal]):
    def __init__(self, db: AsyncSession):
        super().__init__(PresenceGoal, db)

    async def get_user_goals(self, user_id: UUID, journey_id: Optional[UUID] = None) -> List[PresenceGoal]:
        query = select(PresenceGoal).where(PresenceGoal.user_id == user_id)
        if journey_id:
            query = query.where(PresenceGoal.journey_id == journey_id)
        query = query.order_by(PresenceGoal.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_goal(self, goal_id: UUID, user_id: UUID) -> Optional[PresenceGoal]:
        query = select(PresenceGoal).where(PresenceGoal.id == goal_id, PresenceGoal.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()
