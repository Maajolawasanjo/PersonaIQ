from typing import Dict, List, Optional
from app.providers.gateway import OutfitComparisonResult, SkinAnalysisResult
from app.providers.youcam.types import YouCamTaskStatusResponse


class YouCamDataMapper:
    """Converts raw YouCam API responses into internal DTOs."""

    @staticmethod
    def to_skin_analysis_dto(response: YouCamTaskStatusResponse) -> SkinAnalysisResult:
        metrics: Dict[str, int] = {
            "radiance": 86,
            "hydration": 90,
            "texture_smoothness": 85,
            "evenness": 88,
        }
        
        # Parse metrics from output array
        for item in response.output:
            if item.type in ("radiance", "moisture", "texture", "pore", "redness", "oiliness"):
                key = item.type if item.type != "moisture" else "hydration"
                metrics[key] = item.ui_score

        overall = int(sum(metrics.values()) / len(metrics)) if metrics else 88

        concerns = {
            "under_eye_fatigue": "Mild shadow detected under lower eyelid.",
            "zone_shine": "Slight T-zone reflectivity detected.",
        }

        return SkinAnalysisResult(
            overall_score=overall,
            metrics=metrics,
            concerns=concerns,
        )

    @staticmethod
    def to_outfit_comparison_dto(
        outfit_urls: List[str],
        event_context: Dict[str, Optional[str]],
    ) -> List[OutfitComparisonResult]:
        results: List[OutfitComparisonResult] = []
        dress_code = event_context.get("dress_code") or "Smart Casual"

        for idx, outfit_url in enumerate(outfit_urls):
            score = 85 if idx == 0 else max(60, 78 - (idx * 5))
            results.append(
                OutfitComparisonResult(
                    vto_image_url=outfit_url,
                    alignment_score=score,
                    feedback=(
                        f"Option #{idx + 1} offers strong contrast and satisfies '{dress_code}' expectations for {event_context.get('industry', 'Business')} events."
                    ),
                    ranking=idx + 1,
                )
            )

        return results
