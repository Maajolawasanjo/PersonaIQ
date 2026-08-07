from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.journey import Journey, JourneyEventLog
from app.models.upload import OutfitUpload, SelfieUpload


class UploadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_selfie_upload(
        self,
        journey: Journey,
        storage_url: str,
        file_name: Optional[str],
        file_size_bytes: int,
        mime_type: str,
        correlation_id: Optional[str] = None,
    ) -> SelfieUpload:
        selfie = SelfieUpload(
            journey_id=journey.id,
            storage_url=storage_url,
            file_name=file_name,
            file_size_bytes=file_size_bytes,
            mime_type=mime_type,
            processing_status="COMPLETED",
        )
        self.db.add(selfie)

        if journey.current_step == 2:
            journey.current_step = 3

        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="SELFIE_UPLOADED",
            payload={"storage_url": storage_url, "file_name": file_name},
            correlation_id=correlation_id,
        )
        self.db.add(log_entry)
        await self.db.flush()
        return selfie

    async def create_outfit_upload(
        self,
        journey: Journey,
        storage_url: str,
        name: Optional[str],
        category: Optional[str],
        display_order: int,
        file_size_bytes: int,
        mime_type: str,
        correlation_id: Optional[str] = None,
    ) -> OutfitUpload:
        outfit = OutfitUpload(
            journey_id=journey.id,
            storage_url=storage_url,
            name=name,
            category=category,
            display_order=display_order,
            file_size_bytes=file_size_bytes,
            mime_type=mime_type,
        )
        self.db.add(outfit)

        log_entry = JourneyEventLog(
            journey_id=journey.id,
            event_type="OUTFIT_UPLOADED",
            payload={
                "storage_url": storage_url,
                "display_order": display_order,
                "category": category,
            },
            correlation_id=correlation_id,
        )
        self.db.add(log_entry)
        await self.db.flush()
        return outfit

    async def get_selfie(self, journey_id: UUID) -> Optional[SelfieUpload]:
        query = select(SelfieUpload).where(SelfieUpload.journey_id == journey_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_outfits(self, journey_id: UUID) -> List[OutfitUpload]:
        query = (
            select(OutfitUpload)
            .where(OutfitUpload.journey_id == journey_id)
            .order_by(OutfitUpload.display_order.asc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
