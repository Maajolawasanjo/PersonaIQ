from typing import Dict, List, Optional
from app.providers.gateway import OutfitComparisonResult, SkinAnalysisResult
from app.providers.youcam.types import YouCamTaskStatusResponse


class YouCamDataMapper:
    """Converts raw YouCam API responses into internal DTOs."""

    @staticmethod
    def to_skin_analysis_dto(response: YouCamTaskStatusResponse) -> SkinAnalysisResult:
        if response.task_status != "success" or not response.output:
            raise ValueError("Provider did not return a completed skin analysis.")
        metrics: Dict[str, int] = {}
        for item in response.output:
            if item.type in ("radiance", "moisture", "texture", "pore", "redness", "oiliness"):
                key = "hydration" if item.type == "moisture" else item.type
                metrics[key] = max(0, min(100, int(item.ui_score)))

        if not metrics:
            raise ValueError("Provider did not supply supported skin measurements.")
        overall = round(sum(metrics.values()) / len(metrics))
        concerns: Dict[str, str] = {}

        return SkinAnalysisResult(
            overall_score=overall,
            metrics=metrics,
            concerns=concerns,
        )

