import json
import logging
from typing import Dict, List, Optional
import httpx
from app.core.config import settings
from app.providers.gateway import LLMRecommendationResult

logger = logging.getLogger(__name__)


class FeatherlessLLMProvider:
    """Production Featherless LLM API Provider Client with retries, timeouts, and error handling."""

    def __init__(self):
        self.api_key = settings.FEATHERLESS_API_KEY
        self.base_url = settings.FEATHERLESS_BASE_URL.rstrip("/")
        self.model = settings.FEATHERLESS_DEFAULT_MODEL

    async def generate_recommendations(
        self,
        event_context: Dict[str, Optional[str]],
        presence_score: int,
        skin_metrics: Dict[str, int],
    ) -> LLMRecommendationResult:
        """Calls Featherless LLM /v1/chat/completions to generate recommendations and preparation checklist."""

        # System prompt instructing the model to output strict JSON
        system_prompt = (
          "You are the PersonaIQ Executive Presence AI Engine. "
          "Return ONLY a valid raw JSON object matching this structure without any markdown commentary or extra text:\n"
          "{\n"
          '  "recommendations": [\n'
          '    {"category": "OUTFIT"|"GROOMING"|"VIBE", "title": "string", "description": "string", "priority_order": int, "action_type": "string"}\n'
          "  ],\n"
          '  "checklist": [\n'
          '    {"task": "string", "category": "string", "due_offset_minutes": int}\n'
          "  ]\n"
          "}"
        )

        user_prompt = (
          f"Event Context: {json.dumps(event_context)}\n"
          f"Presence Index Score: {presence_score}/100\n"
          f"Skin Intelligence Metrics: {json.dumps(skin_metrics)}\n"
          "Generate 3 customized recommendations and 3 time-mapped checklist items."
        )

        payload = {
          "model": self.model,
          "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
          ],
          "temperature": 0.3,
          "max_tokens": 1000,
        }

        headers = {
          "Authorization": f"Bearer {self.api_key}",
          "Content-Type": "application/json",
        }

        # Attempt up to 3 retries with exponential backoff
        for attempt in range(1, 4):
          try:
            async with httpx.AsyncClient(timeout=25.0) as client:
              response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
              )

              if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"].strip()
                # Clean potential markdown block wrappers
                if content.startswith("```"):
                  content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
                
                parsed = json.loads(content)
                return LLMRecommendationResult(
                  recommendations=parsed.get("recommendations", []),
                  checklist=parsed.get("checklist", []),
                )
              elif response.status_code in (429, 500, 502, 503, 504):
                logger.warning(
                  f"Featherless API attempt {attempt} returned status {response.status_code}. Retrying..."
                )
              else:
                logger.error(
                  f"Featherless API error: status {response.status_code}, body: {response.text}"
                )
                break
          except Exception as e:
            logger.warning(
              f"Featherless API connection attempt {attempt} failed: {e}"
            )

        # Normalized Fallback Result if API is unreachable or rate limited
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
            {
              "task": "Steam & press primary outfit",
              "category": "OUTFIT",
              "due_offset_minutes": -120,
            },
            {
              "task": "Apply hydrating skin serum & matte powder",
              "category": "GROOMING",
              "due_offset_minutes": -45,
            },
            {
              "task": "Review event opening remarks & posture check",
              "category": "MENTAL_PREP",
              "due_offset_minutes": -15,
            },
          ],
        )
