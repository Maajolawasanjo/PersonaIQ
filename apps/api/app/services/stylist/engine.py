import json
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger
from app.services.stylist.schemas import StylistRecommendationResponse
from app.services.stylist.prompts import STYLIST_SYSTEM_PROMPT, STYLIST_RECOMMENDATION_PROMPT_TEMPLATE


class StylistEngine:
    def __init__(self):
        self.api_key = settings.FEATHERLESS_API_KEY
        self.base_url = settings.FEATHERLESS_BASE_URL
        self.model = settings.FEATHERLESS_DEFAULT_MODEL

    async def generate_recommendation(
        self,
        occasion: str,
        target_vibe: str,
        dress_code: str,
        wardrobe_items: List[Dict[str, Any]],
        user_preferences: Optional[Dict[str, Any]] = None,
    ) -> StylistRecommendationResponse:
        """Call Featherless AI Meta Llama model to generate structured styling recommendation."""
        
        prompt = STYLIST_RECOMMENDATION_PROMPT_TEMPLATE.format(
            occasion=occasion,
            target_vibe=target_vibe,
            dress_code=dress_code,
            environment="Executive / Corporate",
            wardrobe_items_json=json.dumps(wardrobe_items[:20], indent=2),
            user_preferences_json=json.dumps(user_preferences or {}, indent=2),
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": STYLIST_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3,
        }

        if not self.api_key:
            logger.info("Featherless API key not provided; returning deterministic fallback styling recommendation.")
            return self._fallback_recommendation(occasion, dress_code, wardrobe_items)

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    return StylistRecommendationResponse(**parsed)
                else:
                    logger.warning("Featherless API status error", status_code=response.status_code)
                    return self._fallback_recommendation(occasion, dress_code, wardrobe_items)
        except Exception as e:
            logger.error("Featherless LLM call failed", error=str(e))
            return self._fallback_recommendation(occasion, dress_code, wardrobe_items)

    def _fallback_recommendation(
        self, occasion: str, dress_code: str, items: List[Dict[str, Any]]
    ) -> StylistRecommendationResponse:
        """Deterministic fallback recommendation if LLM endpoint is unreachable."""
        return StylistRecommendationResponse(
            look_name=f"Executive {occasion.title()} Look",
            total_score=92,
            items=[
                {"category": "Topwear", "item_name": "Tailored Navy Blazer", "color": "Navy", "source": "catalog"},
                {"category": "Bottomwear", "item_name": "Charcoal Dress Trousers", "color": "Charcoal", "source": "catalog"},
                {"category": "Footwear", "item_name": "Classic Black Oxford Shoes", "color": "Black", "source": "catalog"},
                {"category": "Accessories", "item_name": "Classic Silver Chronograph Watch", "color": "Silver", "source": "catalog"},
            ],
            analysis={
                "occasion_fit": 95,
                "color_harmony": 92,
                "formality": 94,
                "cohesion": 90,
            },
            reasoning={
                "summary": f"The navy blazer establishes a structured professional baseline for {occasion}, while charcoal trousers provide balanced weight.",
                "strengths": [
                    "Strong contrast between navy top and charcoal bottom",
                    "High formality alignment for executive settings",
                ],
                "concerns": ["Keep additional jewelry minimal to maintain professional focus"],
                "improvements": ["Ensure leather shoes match belt tone"],
            },
            alternatives=[
                {
                    "item_category": "Footwear",
                    "replacement_name": "Dark Brown Leather Loafers",
                    "reason": "Offers a slightly more approachable executive aesthetic",
                }
            ],
            vto={"ready": True, "avatar_model": "black_male", "items": []},
        )
