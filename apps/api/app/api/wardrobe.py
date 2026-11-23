from datetime import datetime, timezone
from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Request, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel as PydanticBaseModel, Field, field_validator
from app.core.database import get_db
from app.dto.common import ResponseMeta, StandardResponse
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.wardrobe import WardrobeItem, WardrobeOutfit
from app.repositories.wardrobe_repository import WardrobeRepository
from app.repositories.journey_repository import JourneyRepository

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
    repo = WardrobeRepository(db)
    items = await repo.get_user_items(user_id=current_user.id, category=category)

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
    repo = WardrobeRepository(db)
    
    item = WardrobeItem(
        user_id=current_user.id,
        name=item_data.name,
        category=item_data.category,
        color=item_data.color,
        formality=item_data.formality,
        photo_url=item_data.photo_url,
    )
    created_item = await repo.create(item)
    await repo.commit()

    dto = WardrobeItemDTO(
        id=str(created_item.id),
        name=created_item.name,
        category=created_item.category,
        color=created_item.color,
        formality=created_item.formality,
        photo_url=created_item.photo_url,
        wear_count=created_item.wear_count,
        is_favorite=created_item.is_favorite,
    )

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())
    return StandardResponse(success=True, message="Wardrobe item created.", data=dto, meta=meta)


class UpdateFavoriteRequest(PydanticBaseModel):
    is_favorite: bool


@router.patch("/{item_id}/favorite", response_model=StandardResponse[WardrobeItemDTO])
async def update_wardrobe_favorite(
    item_id: UUID,
    payload: UpdateFavoriteRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a wardrobe item's favorite state, scoped to its owner."""
    repo = WardrobeRepository(db)
    item = await repo.get_user_item(item_id=item_id, user_id=current_user.id)
    if item is None:
        raise HTTPException(status_code=404, detail="Wardrobe item not found.")

    item.is_favorite = payload.is_favorite
    await repo.commit()
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
    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_wardrobe_favorite"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(success=True, message="Favorite updated.", data=dto, meta=meta)


class SaveWardrobeLookRequest(PydanticBaseModel):
    name: str = Field(min_length=1, max_length=255)
    image_url: str = Field(min_length=12, max_length=2048)
    items: List[dict[str, Any]] = Field(min_length=1, max_length=12)
    journey_id: Optional[UUID] = None

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, value: str) -> str:
        from urllib.parse import urlsplit
        parsed = urlsplit(value)
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            raise ValueError("Saved look image must use a valid HTTPS URL.")
        return value


class WardrobeLookDTO(PydanticBaseModel):
    id: str
    name: str
    image_url: Optional[str] = None
    journey_id: Optional[str] = None
    items: List[dict[str, Any]]
    created_at: datetime


def to_look_dto(look: WardrobeOutfit) -> WardrobeLookDTO:
    stored = look.items_json if isinstance(look.items_json, dict) else {}
    return WardrobeLookDTO(
        id=str(look.id),
        name=look.name,
        image_url=look.image_url,
        journey_id=str(look.journey_id) if look.journey_id else None,
        items=stored.get("items") if isinstance(stored.get("items"), list) else [],
        created_at=look.created_at,
    )


@router.get("/outfits", response_model=StandardResponse[List[WardrobeLookDTO]])
async def list_saved_outfits(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = WardrobeRepository(db)
    outfits = await repo.get_user_outfits(current_user.id)
    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_wardrobe_outfits"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(
        success=True, message="Saved outfits retrieved.",
        data=[to_look_dto(outfit) for outfit in outfits], meta=meta,
    )


@router.post("/outfits", response_model=StandardResponse[WardrobeLookDTO], status_code=status.HTTP_201_CREATED)
async def save_wardrobe_outfit(
    payload: SaveWardrobeLookRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if payload.journey_id:
        journey_repo = JourneyRepository(db)
        journey = await journey_repo.get_by_id(payload.journey_id, current_user.id)
        if journey is None:
            raise HTTPException(status_code=404, detail="Journey not found.")

    repo = WardrobeRepository(db)
    outfit = WardrobeOutfit(
        user_id=current_user.id,
        journey_id=payload.journey_id,
        name=payload.name.strip(),
        image_url=payload.image_url,
        items_json={"items": payload.items},
    )
    await repo.create_outfit(outfit)
    await repo.commit()
    await db.refresh(outfit)
    meta = ResponseMeta(
        request_id=getattr(request.state, "request_id", "req_save_wardrobe_outfit"),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return StandardResponse(
        success=True, message="Outfit saved to your wardrobe.",
        data=to_look_dto(outfit), meta=meta,
    )
