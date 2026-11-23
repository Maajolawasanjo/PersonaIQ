import json
from typing import Any, Dict
from app.providers.gateway import LLMRecommendationResult


class FeatherlessDataMapper:
    """Normalizes Featherless API responses to LLMRecommendationResult DTO."""

    @staticmethod
    def to_recommendation_dto(content: str, event_context: Dict[str, Any]) -> LLMRecommendationResult:
        try:
            cleaned = content.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
            parsed = json.loads(cleaned)
            return LLMRecommendationResult(
                recommendations=parsed.get("recommendations", []),
                checklist=parsed.get("checklist", []),
            )
        except Exception as exc:
            raise ValueError("AI provider did not return a valid recommendations payload.") from exc
