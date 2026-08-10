from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, String, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel, uuid7
from app.models.journey import JSON_TYPE


class ImportedProduct(BaseModel):
    __tablename__ = "imported_products"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    wardrobe_item_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("wardrobe_items.id", ondelete="SET NULL"), nullable=True
    )

    product_url: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(255))
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    price_amount: Mapped[Optional[float]] = mapped_column(Float)
    currency: Mapped[Optional[str]] = mapped_column(String(10), default="USD")
    merchant_name: Mapped[Optional[str]] = mapped_column(String(100))
    extracted_metadata: Mapped[Optional[dict]] = mapped_column(JSON_TYPE)
    is_processed: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    user: Mapped["User"] = relationship()
