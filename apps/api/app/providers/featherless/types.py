from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class FeatherlessMessage(BaseModel):
    role: str  # "system" | "user" | "assistant"
    content: str


class FeatherlessChatRequest(BaseModel):
    model: str
    messages: List[FeatherlessMessage]
    temperature: float = 0.3
    max_tokens: int = 1000


class FeatherlessRecommendationItem(BaseModel):
    category: str
    title: str
    description: str
    priority_order: int
    action_type: str


class FeatherlessChecklistItem(BaseModel):
    task: str
    category: str
    due_offset_minutes: int


class FeatherlessRecommendationResponse(BaseModel):
    recommendations: List[FeatherlessRecommendationItem] = Field(default_factory=list)
    checklist: List[FeatherlessChecklistItem] = Field(default_factory=list)
    provider_confidence: float = 0.95
