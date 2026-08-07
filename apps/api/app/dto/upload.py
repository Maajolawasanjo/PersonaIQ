from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class SelfieUploadDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    storage_url: str
    file_name: Optional[str] = None
    file_size_bytes: int
    mime_type: str
    processing_status: str = "COMPLETED"
    uploaded_at: datetime


class OutfitUploadDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    storage_url: str
    name: Optional[str] = None
    category: Optional[str] = None
    display_order: int = 1
    file_size_bytes: int
    mime_type: str
    uploaded_at: datetime


class OutfitUploadListDTO(BaseModel):
    outfits: List[OutfitUploadDTO]
