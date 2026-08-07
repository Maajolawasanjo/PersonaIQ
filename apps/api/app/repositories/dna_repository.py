from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.presence_dna import PresenceDNA
from app.repositories.base import BaseRepository

class DNARepository(BaseRepository[PresenceDNA]):
    def __init__(self, db: AsyncSession):
        super().__init__(PresenceDNA, db)

    async def get_latest_user_dna(self, user_id: UUID) -> Optional[PresenceDNA]:
        query = (
            select(PresenceDNA)
            .where(PresenceDNA.user_id == user_id)
            .order_by(PresenceDNA.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_user_dna_history(self, user_id: UUID, limit: int = 10) -> List[PresenceDNA]:
        query = (
            select(PresenceDNA)
            .where(PresenceDNA.user_id == user_id)
            .order_by(PresenceDNA.created_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
