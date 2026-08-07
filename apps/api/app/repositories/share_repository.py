from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.share import SharedJourneyToken
from app.repositories.base import BaseRepository

class ShareRepository(BaseRepository[SharedJourneyToken]):
    def __init__(self, db: AsyncSession):
        super().__init__(SharedJourneyToken, db)

    async def get_by_token(self, token: str) -> Optional[SharedJourneyToken]:
        query = select(SharedJourneyToken).where(SharedJourneyToken.token == token)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_valid_token(self, token: str) -> Optional[SharedJourneyToken]:
        token_obj = await self.get_by_token(token)
        if not token_obj or token_obj.is_revoked:
            return None
        if token_obj.expires_at and token_obj.expires_at < datetime.now(timezone.utc):
            return None
        return token_obj

    async def increment_view_count(self, token_id: UUID) -> None:
        token_obj = await self.get_by_id(token_id)
        if token_obj:
            token_obj.view_count += 1
            await self.db.flush()

    async def get_user_shares(self, user_id: UUID) -> List[SharedJourneyToken]:
        query = (
            select(SharedJourneyToken)
            .where(SharedJourneyToken.user_id == user_id, SharedJourneyToken.is_revoked == False)
            .order_by(SharedJourneyToken.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
