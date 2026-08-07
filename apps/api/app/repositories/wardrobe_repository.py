from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.wardrobe import WardrobeItem, WardrobeOutfit
from app.repositories.base import BaseRepository

class WardrobeRepository(BaseRepository[WardrobeItem]):
    def __init__(self, db: AsyncSession):
        super().__init__(WardrobeItem, db)

    async def get_user_items(self, user_id: UUID, category: Optional[str] = None) -> List[WardrobeItem]:
        query = select(WardrobeItem).where(WardrobeItem.user_id == user_id)
        if category:
            query = query.where(WardrobeItem.category == category)
        query = query.order_by(WardrobeItem.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_item(self, item_id: UUID, user_id: UUID) -> Optional[WardrobeItem]:
        query = select(WardrobeItem).where(WardrobeItem.id == item_id, WardrobeItem.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_outfit(self, outfit: WardrobeOutfit) -> WardrobeOutfit:
        self.db.add(outfit)
        await self.db.flush()
        return outfit

    async def get_user_outfits(self, user_id: UUID) -> List[WardrobeOutfit]:
        query = (
            select(WardrobeOutfit)
            .where(WardrobeOutfit.user_id == user_id)
            .order_by(WardrobeOutfit.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
