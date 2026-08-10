from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, String, Text, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7
from app.models.journey import JSON_TYPE


class StyleProfile(BaseModel):
    __tablename__ = "style_profiles"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    
    style_archetype: Mapped[Optional[str]] = mapped_column(String(100), default="Classic Executive")
    preferred_colors: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    avoid_colors: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    preferred_formality: Mapped[Optional[str]] = mapped_column(String(50), default="Business Formal")
    fit_preference: Mapped[Optional[str]] = mapped_column(String(50), default="Tailored")
    accessory_density: Mapped[Optional[str]] = mapped_column(String(50), default="Minimalist")
    learned_rules: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship()
