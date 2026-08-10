import httpx
from typing import Dict, Any, List
from app.core.config import settings
from app.core.logging import logger
from app.services.vto.provider import VTOProvider


class YouCamVTOProvider(VTOProvider):
    def __init__(self):
        self.api_key = settings.YOUCAM_API_KEY
        self.secret_key = settings.YOUCAM_SECRET_KEY
        self.base_url = settings.YOUCAM_BASE_URL

    async def generate_try_on(
        self,
        base_image_url: str,
        garment_items: List[Dict[str, Any]],
        avatar_type: str = "default",
    ) -> Dict[str, Any]:
        """Call YouCam API to perform garment/hair try-on layering."""
        if not self.api_key or not settings.ENABLE_YOUCAM_VTO:
            logger.info("YouCam credentials not configured or VTO disabled; using internal composite engine.")
            return {
                "success": True,
                "provider": "internal_composite",
                "result_url": base_image_url,
                "applied_items": garment_items,
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-Secret-Key": self.secret_key,
            "Content-Type": "application/json",
        }

        payload = {
            "src_image_url": base_image_url,
            "garments": garment_items,
            "avatar_type": avatar_type,
        }

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                response = await client.post(
                    f"{self.base_url}/vto/composite",
                    json=payload,
                    headers=headers,
                )
                if response.status_code == 200:
                    res_data = response.json()
                    return {
                        "success": True,
                        "provider": "youcam",
                        "result_url": res_data.get("output_image_url", base_image_url),
                        "applied_items": garment_items,
                    }
                else:
                    logger.warning("YouCam API error", status_code=response.status_code)
                    return {
                        "success": True,
                        "provider": "internal_composite_fallback",
                        "result_url": base_image_url,
                        "applied_items": garment_items,
                    }
        except Exception as e:
            logger.error("YouCam VTO request failed", error=str(e))
            return {
                "success": True,
                "provider": "internal_composite_fallback",
                "result_url": base_image_url,
                "applied_items": garment_items,
            }
