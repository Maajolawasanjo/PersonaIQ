from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class SkinAnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    overall_skin_score: int
    metrics: Optional[dict] = None
    concerns: Optional[dict] = None
    created_at: datetime


class OutfitComparisonDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    outfit_id: Optional[UUID] = None
    vto_image_url: Optional[str] = None
    alignment_score: int
    feedback: Optional[str] = None
    ranking: int = 1
    created_at: datetime


class RecommendationDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    presence_plan_id: UUID
    category: str
    title: str
    description: str
    priority_order: int = 1
    action_type: Optional[str] = None


class PreparationChecklistDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    presence_plan_id: UUID
    task: str
    category: str = "GENERAL"
    due_offset_minutes: int = -60
    is_completed: bool = False


class PresencePlanDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    journey_id: UUID
    overall_presence_index: int
    confidence_score: int
    executive_vibe_score: int
    visual_impact_score: int
    grooming_score: int
    outfit_alignment_score: int
    summary_narrative: Optional[str] = None
    created_at: datetime
    recommendations: List[RecommendationDTO] = []
    checklist: List[PreparationChecklistDTO] = []
    skin_analysis: Optional[SkinAnalysisDTO] = None
    outfit_comparisons: List[OutfitComparisonDTO] = []
