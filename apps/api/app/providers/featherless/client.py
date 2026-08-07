import json
import logging
from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from app.providers.featherless.exceptions import (
    FeatherlessAuthError,
    FeatherlessProviderError,
    FeatherlessRateLimitError,
    FeatherlessTimeoutError,
)
from app.providers.featherless.types import FeatherlessChatRequest, FeatherlessRecommendationResponse

logger = logging.getLogger(__name__)


class FeatherlessClient:
    """Raw OpenAI-compatible HTTP client for Featherless AI."""

    def __init__(self):
        self.api_key = settings.FEATHERLESS_API_KEY
        self.base_url = settings.FEATHERLESS_BASE_URL.rstrip("/")
        self.model = settings.FEATHERLESS_DEFAULT_MODEL

    async def chat_completion(self, request: FeatherlessChatRequest) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = request.model_dump()

        for attempt in range(1, 4):
            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    res = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers=headers,
                        json=payload,
                    )
                    if res.status_code == 200:
                        return res.json()
                    elif res.status_code == 401:
                        raise FeatherlessAuthError()
                    elif res.status_code == 429:
                        if attempt == 3:
                            raise FeatherlessRateLimitError()
                    else:
                        logger.warning(f"Featherless API status {res.status_code}: {res.text}")
            except (httpx.TimeoutException, httpx.ConnectError) as e:
                if attempt == 3:
                    raise FeatherlessTimeoutError(str(e))

        raise FeatherlessProviderError("Featherless chat completion failed after retries")
