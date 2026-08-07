from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class EventDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    dress_code: Optional[str] = None
    importance: Optional[int] = 3


class JourneyDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    status: str = "DRAFT"
    current_step: int = 1
    active_presence_index: Optional[int] = None
    active_confidence: Optional[int] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    event: Optional[EventDTO] = None


class CreateJourneyRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title or target event name")


class UpdateEventRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    event_date: Optional[str] = Field(None, max_length=50)
    event_time: Optional[str] = Field(None, max_length=50)
    dress_code: Optional[str] = Field(None, max_length=100)
    importance: Optional[int] = Field(None, ge=1, le=5)
