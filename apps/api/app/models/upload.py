from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7


class SelfieUpload(BaseModel):
    __tablename__ = "selfie_uploads"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False
    )
    storage_url: Mapped[str] = mapped_column(String(512), nullable=False)
    file_name: Mapped[Optional[str]] = mapped_column(String(255))
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    processing_status: Mapped[str] = mapped_column(
        String(50), default="COMPLETED", index=True
    )
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="selfie_uploads")


class OutfitUpload(BaseModel):
    __tablename__ = "outfit_uploads"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    journey_id: Mapped[UUID] = mapped_column(
        ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False
    )
    storage_url: Mapped[str] = mapped_column(String(512), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(255))
    category: Mapped[Optional[str]] = mapped_column(String(100))
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    journey: Mapped["Journey"] = relationship(back_populates="outfit_uploads")
