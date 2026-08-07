from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7

JSON_TYPE = JSONB().with_variant(JSON, "sqlite")


class SkinAnalysis(BaseModel):
    __tablename__ = "skin_analyses"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    overall_skin_score: Mapped[int] = mapped_column(Integer, nullable=False, default=85)
    metrics: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    concerns: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="skin_analysis")


class OutfitComparison(BaseModel):
    __tablename__ = "outfit_comparisons"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False
    )
    outfit_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("outfit_uploads.id", ondelete="SET NULL")
    )
    vto_image_url: Mapped[Optional[str]] = mapped_column(String(512))
    alignment_score: Mapped[int] = mapped_column(Integer, nullable=False, default=80)
    feedback: Mapped[Optional[str]] = mapped_column(Text)
    ranking: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="outfit_comparisons")
