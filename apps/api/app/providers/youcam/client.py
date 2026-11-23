import asyncio
import logging
from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from app.providers.youcam.exceptions import (
    YouCamAuthError,
    YouCamImageValidationError,
    YouCamProviderError,
    YouCamRateLimitError,
    YouCamTimeoutError,
)
from app.providers.youcam.types import YouCamTaskCreateResponse, YouCamTaskStatusResponse, YouCamResultItem

logger = logging.getLogger(__name__)


class YouCamClient:
    """Raw REST API Client isolated for YouCam PerfectCorp AI Services."""

    BASE_URL = "https://yce-api-01.makeupar.com"

    def __init__(self):
        self.api_key = settings.YOUCAM_API_KEY.strip()
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def create_skin_analysis_task(self, image_url: str) -> YouCamTaskCreateResponse:
        """Initiates async Skin Analysis task using a public image URL or file ID."""
        if not self.api_key:
            raise YouCamAuthError("Skin analysis provider has not been configured.")

        payload = {
            "src_file_url": image_url,
            "dst_actions": [
                "wrinkle", "pore", "texture", "acne", 
                "radiance", "moisture", "dark_circle_v2", 
                "age_spot", "redness", "oiliness"
            ],
            "format": "json"
        }

        for attempt in range(1, 4):
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    res = await client.post(
                        f"{self.BASE_URL}/s2s/v2.0/task/skin-analysis",
                        headers=self.headers,
                        json=payload,
                    )
                    
                    if res.status_code == 200:
                        data = res.json()
                        task_id = data.get("data", {}).get("task_id")
                        if not task_id:
                            raise YouCamProviderError("No task_id returned from YouCam API")
                        return YouCamTaskCreateResponse(task_id=task_id, status_code=200)
                    else:
                        logger.warning(f"YouCam API task creation status {res.status_code}: {res.text}")
            except Exception as e:
                logger.warning(f"YouCam API task creation attempt {attempt} failed: {e}")
                await asyncio.sleep(0.5)

        raise YouCamProviderError("Skin analysis provider could not create a real task.")

    async def get_task_status(self, task_id: str) -> YouCamTaskStatusResponse:
        """Polls status for a given task_id."""
        if not self.api_key:
            raise YouCamAuthError("Skin analysis provider has not been configured.")
        for attempt in range(1, 4):
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    res = await client.get(
                        f"{self.BASE_URL}/s2s/v2.0/task/skin-analysis/{task_id}",
                        headers=self.headers,
                    )
                    
                    if res.status_code == 200:
                        data = res.json().get("data", {})
                        status = data.get("task_status", "unknown")
                        
                        outputs = []
                        output_list = data.get("results", {}).get("output", [])
                        for item in output_list:
                            outputs.append(
                                YouCamResultItem(
                                    type=item.get("type", "unknown"),
                                    ui_score=int(item["ui_score"]),
                                    raw_score=float(item["raw_score"]),
                                    mask_urls=item.get("mask_urls", []),
                                )
                            )
                        
                        if status == "success" and outputs:
                            return YouCamTaskStatusResponse(
                                task_id=task_id,
                                task_status=status,
                                output=outputs,
                                raw_response=data,
                            )
                        if status in ("error", "failed"):
                            raise YouCamProviderError("Skin analysis provider rejected the task.")
                        # A running task must not be treated as completed.
                        await asyncio.sleep(1.0)
                    elif res.status_code == 401:
                        raise YouCamAuthError()
                    elif res.status_code == 429:
                        raise YouCamRateLimitError()
            except (httpx.TimeoutException, httpx.ConnectError) as e:
                if attempt == 3:
                    raise YouCamTimeoutError(str(e))
                await asyncio.sleep(1.0)

        raise YouCamProviderError("Skin analysis provider did not return a completed result.")
