from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, JSON, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7

# Portable JSON column: JSONB on PostgreSQL, JSON on SQLite
JSON_TYPE = JSONB().with_variant(JSON, "sqlite")


class Journey(BaseModel):
    __tablename__ = "journeys"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True)
    current_step: Mapped[int] = mapped_column(Integer, default=1)

    active_presence_index: Mapped[Optional[int]] = mapped_column(Integer)
    active_confidence: Mapped[Optional[int]] = mapped_column(Integer)

    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    user: Mapped["User"] = relationship(back_populates="journeys")
    event: Mapped[Optional["Event"]] = relationship(
        back_populates="journey", uselist=False, cascade="all, delete-orphan"
    )
    event_logs: Mapped[List["JourneyEventLog"]] = relationship(
        back_populates="journey", cascade="all, delete-orphan"
    )
    selfie_uploads: Mapped[List["SelfieUpload"]] = relationship(
        back_populates="journey", cascade="all, delete-orphan"
    )
    outfit_uploads: Mapped[List["OutfitUpload"]] = relationship(
        back_populates="journey", cascade="all, delete-orphan"
    )
    skin_analysis: Mapped[Optional["SkinAnalysis"]] = relationship(
        back_populates="journey", uselist=False, cascade="all, delete-orphan"
    )
    outfit_comparisons: Mapped[List["OutfitComparison"]] = relationship(
        back_populates="journey", cascade="all, delete-orphan"
    )
    presence_plan: Mapped[Optional["PresencePlan"]] = relationship(
        back_populates="journey", uselist=False, cascade="all, delete-orphan"
    )


class Event(BaseModel):
    __tablename__ = "events"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    name: Mapped[Optional[str]] = mapped_column(String(255))
    industry: Mapped[Optional[str]] = mapped_column(String(100))
    location: Mapped[Optional[str]] = mapped_column(String(255))
    event_date: Mapped[Optional[str]] = mapped_column(String(50))
    event_time: Mapped[Optional[str]] = mapped_column(String(50))
    dress_code: Mapped[Optional[str]] = mapped_column(String(100))
    importance: Mapped[Optional[int]] = mapped_column(Integer, default=3)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    journey: Mapped["Journey"] = relationship(back_populates="event")


class JourneyEventLog(BaseModel):
    """Event Sourcing Lite — Tracks timeline state transitions"""

    __tablename__ = "journey_event_logs"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False
    )
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    payload: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    correlation_id: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="event_logs")
