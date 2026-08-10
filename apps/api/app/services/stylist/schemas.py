from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class LookItemRef(BaseModel):
    category: str = Field(..., description="Topwear, Bottomwear, Footwear, Accessories, Hairstyle")
    item_id: Optional[str] = Field(None, description="Database UUID or catalog key")
    item_name: str = Field(..., description="Name of the selected garment or item")
    color: Optional[str] = Field(None, description="Garment color")
    source: str = Field("wardrobe", description="wardrobe | catalog | online_import")


class StyleAnalysisScores(BaseModel):
    occasion_fit: int = Field(..., ge=0, le=100, description="Formality and event context match score")
    color_harmony: int = Field(..., ge=0, le=100, description="Color palette and psychological vibe match")
    formality: int = Field(..., ge=0, le=100, description="Formality level compliance")
    cohesion: int = Field(..., ge=0, le=100, description="Overall outfit style cohesion score")


class StylistReasoning(BaseModel):
    summary: str = Field(..., description="Professional executive summary explanation")
    strengths: List[str] = Field(default_factory=list, description="Key visual strengths of the combination")
    concerns: List[str] = Field(default_factory=list, description="Potential style or formality risks")
    improvements: List[str] = Field(default_factory=list, description="Actionable micro-adjustments")


class StyleAlternative(BaseModel):
    item_category: str
    replacement_name: str
    reason: str


class VTOPreparation(BaseModel):
    ready: bool = Field(True, description="Whether all items are ready for VTO composite rendering")
    avatar_model: str = Field("default", description="Avatar mannequin or user selfie ID")
    items: List[LookItemRef] = Field(default_factory=list)


class StylistRecommendationResponse(BaseModel):
    look_name: str = Field(..., description="Descriptive title of the recommended look")
    total_score: int = Field(..., ge=0, le=100, description="Overall Executive Presence Index")
    items: List[LookItemRef] = Field(default_factory=list)
    analysis: StyleAnalysisScores
    reasoning: StylistReasoning
    alternatives: List[StyleAlternative] = Field(default_factory=list)
    vto: VTOPreparation
