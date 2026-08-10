from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class VTOProvider(ABC):
    @abstractmethod
    async def generate_try_on(
        self,
        base_image_url: str,
        garment_items: List[Dict[str, Any]],
        avatar_type: str = "default",
    ) -> Dict[str, Any]:
        """Generate virtual try-on composite image result."""
        pass
