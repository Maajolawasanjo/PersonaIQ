import re
import httpx
from typing import Dict, Any, Optional
from urllib.parse import urlparse
from app.core.logging import logger


class ProductImporter:
    async def import_from_url(self, product_url: str) -> Dict[str, Any]:
        """Extract e-commerce product image and metadata from URL."""
        parsed = urlparse(product_url)
        domain = parsed.netloc.replace("www.", "").split(".")[0].title()

        title = "Imported Garment"
        image_url = product_url

        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                resp = await client.get(product_url)
                if resp.status_code == 200:
                    html = resp.text
                    
                    # Extract og:image
                    img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
                    if img_match:
                        image_url = img_match.group(1)

                    # Extract og:title
                    title_match = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html, re.I)
                    if title_match:
                        title = title_match.group(1)
        except Exception as e:
            logger.warning("Product URL scraping warning", error=str(e), url=product_url)

        # AI Classification fallback inference
        category = "clothing"
        if "shoe" in title.lower() or "boot" in title.lower() or "sneaker" in title.lower() or "loafer" in title.lower():
            category = "footwear"
        elif "watch" in title.lower() or "bag" in title.lower() or "tie" in title.lower() or "glass" in title.lower():
            category = "accessories"
        elif "suit" in title.lower() or "blazer" in title.lower() or "trousers" in title.lower():
            category = "clothing"

        return {
            "product_url": product_url,
            "product_name": title[:255],
            "brand": domain,
            "image_url": image_url,
            "category": category,
            "formality": "Business Casual",
            "source_type": "online_import",
        }
