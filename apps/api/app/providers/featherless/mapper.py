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
        except Exception:
            return LLMRecommendationResult(
                recommendations=[
                    {
                        "category": "OUTFIT",
                        "title": "Structure & Contrast Optimization",
                        "description": f"Tailored suit silhouette aligns perfectly with '{event_context.get('dress_code', 'Formal')}' standards. Ensure sharp shoulder lines.",
                        "priority_order": 1,
                        "action_type": "WEAR_PRIMARY_OUTFIT",
                    },
                    {
                        "category": "GROOMING",
                        "title": "Pre-Event Hydration & Matte Finish",
                        "description": "Apply a lightweight hydrating serum 45 minutes prior to entry to maximize skin radiance score.",
                        "priority_order": 2,
                        "action_type": "SKINCARE_PREP",
                    },
                    {
                        "category": "VIBE",
                        "title": "Executive Eye Contact & Posture",
                        "description": "Maintain open upper-body posture and 3-second eye contact during key stage introductions.",
                        "priority_order": 3,
                        "action_type": "POSTURE_FOCUS",
                    },
                ],
                checklist=[
                    {"task": "Steam & press primary outfit", "category": "OUTFIT", "due_offset_minutes": -120},
                    {"task": "Apply hydrating skin serum & matte powder", "category": "GROOMING", "due_offset_minutes": -45},
                    {"task": "Review event opening remarks & posture check", "category": "MENTAL_PREP", "due_offset_minutes": -15},
                ],
            )
