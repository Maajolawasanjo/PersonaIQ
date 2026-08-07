from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7


class PresencePlan(BaseModel):
    __tablename__ = "presence_plans"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    overall_presence_index: Mapped[int] = mapped_column(Integer, nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False, default=90)

    executive_vibe_score: Mapped[int] = mapped_column(Integer, nullable=False)
    visual_impact_score: Mapped[int] = mapped_column(Integer, nullable=False)
    grooming_score: Mapped[int] = mapped_column(Integer, nullable=False)
    outfit_alignment_score: Mapped[int] = mapped_column(Integer, nullable=False)

    summary_narrative: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="presence_plan")
    recommendations: Mapped[List["Recommendation"]] = relationship(
        back_populates="presence_plan", cascade="all, delete-orphan"
    )
    checklist: Mapped[List["PreparationChecklist"]] = relationship(
        back_populates="presence_plan", cascade="all, delete-orphan"
    )


class Recommendation(BaseModel):
    __tablename__ = "recommendations"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    presence_plan_id: Mapped[UUID] = mapped_column(
        ForeignKey("presence_plans.id", ondelete="CASCADE"), index=True, nullable=False
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority_order: Mapped[int] = mapped_column(Integer, default=1)
    action_type: Mapped[Optional[str]] = mapped_column(String(50))

    presence_plan: Mapped["PresencePlan"] = relationship(
        back_populates="recommendations"
    )


class PreparationChecklist(BaseModel):
    __tablename__ = "preparation_checklists"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    presence_plan_id: Mapped[UUID] = mapped_column(
        ForeignKey("presence_plans.id", ondelete="CASCADE"), index=True, nullable=False
    )
    task: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="GENERAL")
    due_offset_minutes: Mapped[int] = mapped_column(Integer, default=-60)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    presence_plan: Mapped["PresencePlan"] = relationship(back_populates="checklist")
