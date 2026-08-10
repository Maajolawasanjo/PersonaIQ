from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7
from app.models.journey import JSON_TYPE


class WardrobeItem(BaseModel):
    __tablename__ = "wardrobe_items"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    # Legacy properties
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    color: Mapped[Optional[str]] = mapped_column(String(50))
    formality: Mapped[Optional[str]] = mapped_column(String(50), default="Business Casual")
    photo_url: Mapped[Optional[str]] = mapped_column(Text)
    youcam_asset_id: Mapped[Optional[str]] = mapped_column(String(255))
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    wear_count: Mapped[int] = mapped_column(Integer, default=0)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)

    # Classification
    subcategory: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    garment_type: Mapped[Optional[str]] = mapped_column(String(100))
    gender_target: Mapped[Optional[str]] = mapped_column(String(50), default="unisex")
    style_family: Mapped[Optional[str]] = mapped_column(String(100))

    # Visual Attributes
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text)
    secondary_colors: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    pattern: Mapped[Optional[str]] = mapped_column(String(100))
    material: Mapped[Optional[str]] = mapped_column(String(100))
    silhouette: Mapped[Optional[str]] = mapped_column(String(100))

    # Styling & Taxonomy Intelligence
    occasions: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    seasons: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    compatible_categories: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    style_tags: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    color_profile: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)

    # Source Provenance
    source_type: Mapped[str] = mapped_column(String(50), default="user_upload", index=True)
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    brand: Mapped[Optional[str]] = mapped_column(String(255))
    product_url: Mapped[Optional[str]] = mapped_column(Text)
    external_product_id: Mapped[Optional[str]] = mapped_column(String(255))

    # Virtual Try-On Capabilities
    vto_supported: Mapped[bool] = mapped_column(Boolean, default=True)
    vto_category: Mapped[Optional[str]] = mapped_column(String(100))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship()


class WardrobeOutfit(BaseModel):
    __tablename__ = "wardrobe_outfits"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    journey_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("journeys.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    alignment_score: Mapped[int] = mapped_column(Integer, default=90)
    image_url: Mapped[Optional[str]] = mapped_column(Text)
    items_json: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    user: Mapped["User"] = relationship()
