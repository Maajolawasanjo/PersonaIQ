from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class SkinAnalysisResult:
    overall_score: int
    metrics: Dict[str, int]
    concerns: Dict[str, str]


@dataclass
class OutfitComparisonResult:
    vto_image_url: str
    alignment_score: int
    feedback: str
    ranking: int


@dataclass
class LLMRecommendationResult:
    recommendations: List[Dict[str, str]]
    checklist: List[Dict[str, str]]


from app.providers.featherless.adapter import FeatherlessAdapter
from app.providers.youcam.adapter import YouCamAdapter


class AIGateway:
    """Unified AI Provider Gateway delegating to production Featherless and YouCam adapters."""

    def __init__(self):
        self.featherless_adapter = FeatherlessAdapter()
        self.youcam_adapter = YouCamAdapter()

    async def analyze_skin(self, selfie_url: str) -> SkinAnalysisResult:
        """Invokes YouCam Skin AI provider adapter."""
        return await self.youcam_adapter.execute("skin_analysis", selfie_url=selfie_url)

    async def compare_outfits(
        self,
        selfie_url: str,
        outfit_urls: List[str],
        event_context: Dict[str, Optional[str]],
    ) -> List[OutfitComparisonResult]:
        """Invokes YouCam VTO & Outfit Alignment provider adapter."""
        return await self.youcam_adapter.execute(
            "vto_compare",
            selfie_url=selfie_url,
            outfit_urls=outfit_urls,
            event_context=event_context,
        )

    async def generate_recommendations(
        self,
        event_context: Dict[str, Optional[str]],
        presence_score: int,
        skin_metrics: Dict[str, int],
    ) -> LLMRecommendationResult:
        """Invokes Featherless LLM provider adapter."""
        return await self.featherless_adapter.execute(
            "generate_recommendations",
            event_context=event_context,
            presence_score=presence_score,
            skin_metrics=skin_metrics,
        )
