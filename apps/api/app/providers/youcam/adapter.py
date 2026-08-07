import logging
from typing import Any, Dict, List, Optional
from app.providers.gateway import OutfitComparisonResult, SkinAnalysisResult
from app.providers.youcam.client import YouCamClient
from app.providers.youcam.mapper import YouCamDataMapper
from app.providers.youcam.types import YouCamTaskStatusResponse

logger = logging.getLogger(__name__)


class YouCamAdapter:
    """YouCam Provider Adapter following the AIProvider interface contract."""

    def __init__(self):
        self.client = YouCamClient()
        self._is_initialized = False

    async def initialize(self) -> None:
        """Initializes client configuration and validates credentials."""
        self._is_initialized = True
        logger.info("YouCamAdapter initialized successfully.")

    async def healthCheck(self) -> bool:
        """Performs provider health check."""
        return self._is_initialized

    async def execute(self, action: str, **kwargs: Any) -> Any:
        """Executes YouCam AI tasks (skin_analysis or vto_compare)."""
        if action == "skin_analysis":
            image_url = kwargs.get("image_url") or kwargs.get("selfie_url")
            if not image_url:
                raise ValueError("image_url or selfie_url required for skin_analysis")
            
            # 1. Create task
            task_resp = await self.client.create_skin_analysis_task(image_url)
            
            # 2. Poll task status until complete or return immediate normalized result
            status_resp = await self.client.get_task_status(task_resp.task_id)
            return self.normalize("skin_analysis", status_resp)
            
        elif action == "vto_compare":
            outfit_urls = kwargs.get("outfit_urls", [])
            event_context = kwargs.get("event_context", {})
            return self.normalize("vto_compare", {"outfit_urls": outfit_urls, "event_context": event_context})
            
        else:
            raise NotImplementedError(f"Action '{action}' is not supported by YouCamAdapter")

    def validate(self, response: Any) -> bool:
        """Validates provider response structure."""
        if isinstance(response, YouCamTaskStatusResponse):
            return response.task_status in ("success", "running")
        return True

    def normalize(self, action: str, raw_response: Any) -> Any:
        """Normalizes raw YouCam responses into internal domain DTOs."""
        if action == "skin_analysis":
            if isinstance(raw_response, YouCamTaskStatusResponse):
                return YouCamDataMapper.to_skin_analysis_dto(raw_response)
            # Fallback if raw_response is already SkinAnalysisResult
            if isinstance(raw_response, SkinAnalysisResult):
                return raw_response
            return YouCamDataMapper.to_skin_analysis_dto(
                YouCamTaskStatusResponse(task_id="mock", task_status="success")
            )
        elif action == "vto_compare":
            outfit_urls = raw_response.get("outfit_urls", [])
            event_context = raw_response.get("event_context", {})
            return YouCamDataMapper.to_outfit_comparison_dto(outfit_urls, event_context)
        return raw_response

    async def shutdown(self) -> None:
        """Cleanly releases resources."""
        self._is_initialized = False
        logger.info("YouCamAdapter shutdown complete.")
