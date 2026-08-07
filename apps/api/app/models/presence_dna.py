from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7
from app.models.journey import JSON_TYPE


class PresenceDNA(BaseModel):
    __tablename__ = "presence_dna"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    avg_presence_index: Mapped[float] = mapped_column(Float, default=84.2)
    vocal_confidence_base: Mapped[float] = mapped_column(Float, default=92.0)
    visual_authority_base: Mapped[float] = mapped_column(Float, default=87.0)
    executive_presence_base: Mapped[float] = mapped_column(Float, default=89.0)
    total_journeys_completed: Mapped[int] = mapped_column(Integer, default=0)
    top_style: Mapped[str] = mapped_column(String(100), default="Minimalist Corporate")
    trajectory_data: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    achievements_json: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship()


class PresenceGoal(BaseModel):
    __tablename__ = "presence_goals"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_metric: Mapped[str] = mapped_column(String(100), nullable=False)
    current_value: Mapped[float] = mapped_column(Float, default=0.0)
    target_value: Mapped[float] = mapped_column(Float, default=100.0)
    deadline: Mapped[Optional[str]] = mapped_column(String(100))
    is_achieved: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship()
