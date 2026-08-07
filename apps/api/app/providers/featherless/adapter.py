import json
import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.providers.featherless.client import FeatherlessClient
from app.providers.featherless.mapper import FeatherlessDataMapper
from app.providers.featherless.types import FeatherlessChatRequest, FeatherlessMessage
from app.providers.gateway import LLMRecommendationResult

logger = logging.getLogger(__name__)


class FeatherlessAdapter:
    """Featherless Provider Adapter implementing the AIProvider interface contract."""

    def __init__(self):
        self.client = FeatherlessClient()
        self._is_initialized = False

    async def initialize(self) -> None:
        """Initializes client configuration."""
        self._is_initialized = True
        logger.info("FeatherlessAdapter initialized successfully.")

    async def healthCheck(self) -> bool:
        """Performs provider health check."""
        return self._is_initialized

    def _sanitize_input(self, text: str) -> str:
        """Sanitizes user input strings to prevent AI prompt injection / jailbreak attacks."""
        if not text:
            return ""
        # Remove known prompt injection directives
        bad_patterns = [
            "ignore previous instructions",
            "system prompt",
            "you are now",
            "developer mode",
            "override instructions",
        ]
        sanitized = text
        for pattern in bad_patterns:
            if pattern in sanitized.lower():
                import re
                sanitized = re.sub(re.escape(pattern), "[REDACTED]", sanitized, flags=re.IGNORECASE)
        return sanitized

    async def execute(self, action: str, **kwargs: Any) -> Any:
        """Executes Featherless AI recommendations task."""
        if action == "generate_recommendations":
            event_context = kwargs.get("event_context", {})
            presence_score = kwargs.get("presence_score", 85)
            skin_metrics = kwargs.get("skin_metrics", {})

            # Sanitize event context values to prevent prompt injection
            clean_context = {
                k: self._sanitize_input(str(v)) if isinstance(v, str) else v
                for k, v in event_context.items()
            }

            system_prompt = (
                "You are the PersonaIQ Executive Presence AI Engine. "
                "Return ONLY a valid raw JSON object matching this structure:\n"
                "{\n"
                '  "recommendations": [{"category": "OUTFIT"|"GROOMING"|"VIBE", "title": "string", "description": "string", "priority_order": int, "action_type": "string"}],\n'
                '  "checklist": [{"task": "string", "category": "string", "due_offset_minutes": int}]\n'
                "}"
            )
            user_prompt = (
                f"Event Context: {json.dumps(clean_context)}\n"
                f"Presence Index Score: {presence_score}/100\n"
                f"Skin Metrics: {json.dumps(skin_metrics)}\n"
                "Generate 3 customized recommendations and 3 checklist items."
            )

            req = FeatherlessChatRequest(
                model=settings.FEATHERLESS_DEFAULT_MODEL,
                messages=[
                    FeatherlessMessage(role="system", content=system_prompt),
                    FeatherlessMessage(role="user", content=user_prompt),
                ],
                temperature=0.3,
            )

            try:
                res = await self.client.chat_completion(req)
                content = res["choices"][0]["message"]["content"]
                return self.normalize(action, content, event_context=event_context)
            except Exception as e:
                logger.warning(f"Featherless execute failed: {e}. Utilizing fallback normalization.")
                return self.normalize(action, "", event_context=event_context)
        else:
            raise NotImplementedError(f"Action '{action}' not supported by FeatherlessAdapter")

    def validate(self, response: Any) -> bool:
        """Validates response DTO."""
        return isinstance(response, LLMRecommendationResult)

    def normalize(self, action: str, raw_response: Any, **kwargs: Any) -> Any:
        """Normalizes provider response to LLMRecommendationResult."""
        event_context = kwargs.get("event_context", {})
        return FeatherlessDataMapper.to_recommendation_dto(str(raw_response), event_context)

    async def shutdown(self) -> None:
        """Shutdown provider adapter."""
        self._is_initialized = False
        logger.info("FeatherlessAdapter shutdown complete.")
