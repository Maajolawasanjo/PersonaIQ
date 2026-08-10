from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.wardrobe import WardrobeItem
from app.services.stylist import StylistEngine, StylistRecommendationResponse
from app.services.vto import VTOEngine, STOCK_AVATARS
from app.services.product_import import ProductImporter

router = APIRouter(prefix="/stylist", tags=["Stylist & VTO Intelligence"])


class StyleMeRequest(BaseModel):
    occasion: str = Field(..., example="Job Interview")
    target_vibe: str = Field("Authoritative", example="Authoritative")
    dress_code: str = Field("Business Formal", example="Business Formal")


class VTOPreviewRequest(BaseModel):
    avatar_choice: str = Field("black_male", example="black_male")
    user_photo_url: Optional[str] = None
    items: List[Dict[str, Any]] = Field(default_factory=list)


class ProductImportRequest(BaseModel):
    product_url: str = Field(..., example="https://store.example.com/item")


@router.post("/recommend-look", response_model=StylistRecommendationResponse)
async def recommend_look(
    payload: StyleMeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate executive AI styling recommendation using Featherless LLM reasoning engine."""
    # Fetch user wardrobe items
    stmt = select(WardrobeItem).where(WardrobeItem.user_id == current_user.id).limit(50)
    result = await db.execute(stmt)
    items = result.scalars().all()

    wardrobe_list = [
        {
            "id": str(item.id),
            "name": item.name,
            "category": item.category,
            "formality": item.formality,
            "source_type": item.source_type,
        }
        for item in items
    ]

    engine = StylistEngine()
    recommendation = await engine.generate_recommendation(
        occasion=payload.occasion,
        target_vibe=payload.target_vibe,
        dress_code=payload.dress_code,
        wardrobe_items=wardrobe_list,
    )

    return recommendation


@router.post("/vto-preview")
async def vto_preview(
    payload: VTOPreviewRequest,
    current_user: User = Depends(get_current_user),
):
    """Execute Virtual Try-On composite rendering across stock avatars or user photo."""
    engine = VTOEngine()
    result = await engine.run_vto_session(
        avatar_choice=payload.avatar_choice,
        user_photo_url=payload.user_photo_url,
        items=payload.items,
    )
    return {"success": True, "data": result}


@router.post("/import-product")
async def import_product(
    payload: ProductImportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Extract e-commerce product info and create normalized WardrobeItem."""
    importer = ProductImporter()
    extracted = await importer.import_from_url(payload.product_url)

    new_item = WardrobeItem(
        user_id=current_user.id,
        name=extracted["product_name"],
        category=extracted["category"],
        formality=extracted["formality"],
        photo_url=extracted["image_url"],
        brand=extracted["brand"],
        product_url=extracted["product_url"],
        source_type="online_import",
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)

    return {
        "success": True,
        "message": "Product imported into wardrobe successfully.",
        "data": {
            "id": str(new_item.id),
            "name": new_item.name,
            "category": new_item.category,
            "photo_url": new_item.photo_url,
            "brand": new_item.brand,
            "source_type": new_item.source_type,
        },
    }


from app.services.stylist.wardrobe_gap import WardrobeGapEngine


@router.post("/wardrobe-gaps")
async def analyze_wardrobe_gaps(
    occasion: str = "interview",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Analyze user wardrobe gaps and readiness score for a specific occasion."""
    stmt = select(WardrobeItem).where(WardrobeItem.user_id == current_user.id)
    result = await db.execute(stmt)
    items = result.scalars().all()

    item_dicts = [{"category": item.category, "name": item.name} for item in items]
    engine = WardrobeGapEngine()
    analysis = engine.analyze_gaps(occasion, item_dicts)

    return {"success": True, "data": analysis.model_dump()}


@router.get("/avatars")
async def get_stock_avatars():
    """Fetch available stock avatar mannequins."""
    return {"success": True, "data": STOCK_AVATARS}
