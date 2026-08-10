from typing import Dict, Any, List, Optional
from app.services.vto.youcam import YouCamVTOProvider

STOCK_AVATARS = {
    "black_male": "/vto and more/black male.png",
    "black_female": "/vto and more/black female.png",
    "white_male": "/vto and more/white male.png",
    "white_female": "/vto and more/white female.png",
}


class VTOEngine:
    def __init__(self):
        self.provider = YouCamVTOProvider()

    async def run_vto_session(
        self,
        avatar_choice: str,
        user_photo_url: Optional[str],
        items: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Resolve base avatar model and execute VTO try-on composite."""
        
        # Determine base canvas image URL
        if avatar_choice == "user_photo" and user_photo_url:
            base_url = user_photo_url
        elif avatar_choice in STOCK_AVATARS:
            base_url = STOCK_AVATARS[avatar_choice]
        else:
            base_url = STOCK_AVATARS["black_male"]

        # Delegate visual rendering to provider
        vto_result = await self.provider.generate_try_on(
            base_image_url=base_url,
            garment_items=items,
            avatar_type=avatar_choice,
        )

        return {
            "avatar_choice": avatar_choice,
            "base_image_url": base_url,
            "result_image_url": vto_result.get("result_url", base_url),
            "provider_used": vto_result.get("provider", "internal_composite"),
            "items_applied": items,
        }
