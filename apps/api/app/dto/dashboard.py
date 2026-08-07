from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from app.dto.journey import JourneyDTO
from app.dto.presence import PresencePlanDTO


class DashboardOverviewDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    active_journey: Optional[JourneyDTO] = None
    presence_index_avg: float = 0.0
    completed_journeys_count: int = 0
    total_journeys_count: int = 0
    recent_plans: List[PresencePlanDTO] = []
    quick_stats: Dict[str, str] = {}
