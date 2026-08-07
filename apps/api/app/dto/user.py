from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserPreferenceDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    preferred_theme: str = "dark"
    default_event_type: Optional[str] = None
    email_notifications: bool = True


class UserDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    occupation: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = "UTC"
    is_active: bool = True
    is_verified: bool = False
    onboarding_completed: bool = False
    created_at: datetime
    preference: Optional[UserPreferenceDTO] = None


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    occupation: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    timezone: Optional[str] = Field(None, max_length=50)


class OnboardingRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    occupation: Optional[str] = Field(None, max_length=100)
    default_event_type: Optional[str] = Field(None, max_length=50)
