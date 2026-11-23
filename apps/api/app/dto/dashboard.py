from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.dto.journey import JourneyDTO
from app.dto.presence import PresencePlanDTO


class DashboardOverviewDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    active_journey: Optional[JourneyDTO] = None
    # Historical raw scores lack verified provider provenance. Treat absent
    # measurements as missing, not a recorded value of zero.
    presence_index_avg: Optional[float] = None
    completed_journeys_count: int = 0
    total_journeys_count: int = 0
    recent_journeys: List[JourneyDTO] = Field(default_factory=list)
    recent_plans: List[PresencePlanDTO] = Field(default_factory=list)
    quick_stats: Dict[str, str] = Field(default_factory=dict)
