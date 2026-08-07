from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Request, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel as PydanticBaseModel
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.wardrobe import WardrobeItem, WardrobeOutfit

router = APIRouter(prefix="/wardrobe", tags=["Wardrobe Management"])


class CreateWardrobeItemRequest(PydanticBaseModel):
    name: str
    category: str
    color: Optional[str] = None
    formality: Optional[str] = "Business Casual"
    photo_url: Optional[str] = None


class WardrobeItemDTO(PydanticBaseModel):
    id: str
    name: str
    category: str
    color: Optional[str]
    formality: Optional[str]
    photo_url: Optional[str]
    wear_count: int
    is_favorite: bool


@router.get("", response_model=StandardResponse[List[WardrobeItemDTO]])
async def list_wardrobe_items(
    request: Request,
    category: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_wardrobe_list")
    query = select(WardrobeItem).where(WardrobeItem.user_id == current_user.id)
    if category:
        query = query.where(WardrobeItem.category == category)
    
    result = await db.execute(query)
    items = result.scalars().all()

    dtos = [
        WardrobeItemDTO(
            id=str(item.id),
            name=item.name,
            category=item.category,
            color=item.color,
            formality=item.formality,
            photo_url=item.photo_url,
            wear_count=item.wear_count,
            is_favorite=item.is_favorite,
        )
        for item in items
    ]

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Wardrobe items retrieved.", data=dtos, meta=meta)


@router.post("", response_model=StandardResponse[WardrobeItemDTO], status_code=status.HTTP_201_CREATED)
async def create_wardrobe_item(
    item_data: CreateWardrobeItemRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    request_id = getattr(request.state, "request_id", "req_wardrobe_create")
    item = WardrobeItem(
        user_id=current_user.id,
        name=item_data.name,
        category=item_data.category,
        color=item_data.color,
        formality=item_data.formality,
        photo_url=item_data.photo_url,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    dto = WardrobeItemDTO(
        id=str(item.id),
        name=item.name,
        category=item.category,
        color=item.color,
        formality=item.formality,
        photo_url=item.photo_url,
        wear_count=item.wear_count,
        is_favorite=item.is_favorite,
    )

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Wardrobe item created.", data=dto, meta=meta)
