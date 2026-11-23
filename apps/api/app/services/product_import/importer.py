import re
from typing import Any, Dict
from ipaddress import ip_address
from urllib.parse import urlparse, urljoin

import httpx

from app.core.errors import AppException, ErrorCode
from app.core.logging import logger


# Approved domains only. This is intentional: arbitrary URL fetching allows SSRF.
# Add new retailers after reviewing redirects, DNS behavior, and scraping terms.
APPROVED_RETAILERS = frozenset({
    "zara.com", "asos.com", "nordstrom.com", "hm.com", "uniqlo.com",
})
MAX_HTML_BYTES = 512 * 1024


def validate_retailer_url(product_url: str) -> str:
    parsed = urlparse(product_url)
    hostname = (parsed.hostname or "").lower().rstrip(".")
    trusted = any(
        hostname == retailer or hostname == "www." + retailer
        for retailer in APPROVED_RETAILERS
    )
    try:
        port = parsed.port
    except ValueError:
        port = -1
    if (
        parsed.scheme != "https"
        or not trusted
        or parsed.username
        or parsed.password
        or port not in (None, 443)
    ):
        raise AppException(
            code=ErrorCode.SYS_003,
            message="Product import supports HTTPS links from approved retailers only.",
            status_code=422,
        )
    return hostname


class ProductImporter:
    async def import_from_url(self, product_url: str) -> Dict[str, Any]:
        """Fetch bounded HTML from approved retailers; never follow redirects."""
        hostname = validate_retailer_url(product_url)
        html = ""

        try:
            async with httpx.AsyncClient(timeout=12.0, follow_redirects=False) as client:
                async with client.stream("GET", product_url, headers={"Accept": "text/html"}) as response:
                    if response.status_code != 200:
                        raise ValueError("Retailer did not return a product page.")
                    content_type = response.headers.get("content-type", "").lower()
                    if "text/html" not in content_type:
                        raise ValueError("URL did not return an HTML product page.")
                    size = 0
                    chunks = []
                    async for chunk in response.aiter_bytes():
                        size += len(chunk)
                        if size > MAX_HTML_BYTES:
                            raise ValueError("Product page exceeds import size limit.")
                        chunks.append(chunk)
                    html = b"".join(chunks).decode("utf-8", errors="replace")
        except Exception as error:
            logger.warning("Retailer product import failed", reason=type(error).__name__)
            raise AppException(
                code=ErrorCode.SYS_002,
                message="The retailer could not be reached or its product page is unsupported.",
                status_code=422,
            ) from error

        title_match = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html, re.I)
        image_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)

        if not title_match or not image_match:
            raise AppException(
                code=ErrorCode.SYS_003,
                message="No supported product image and title were found on this page.",
                status_code=422,
            )

        from html import unescape
        title = unescape(title_match.group(1)).strip()[:255]
        image_url = urljoin(product_url, unescape(image_match.group(1)))
        image_parsed = urlparse(image_url)
        image_host = (image_parsed.hostname or "").lower().rstrip(".")
        try:
            private_address = not ip_address(image_host).is_global
        except ValueError:
            private_address = False
        if (
            not title or image_parsed.scheme != "https"
            or not image_host or image_host in {"localhost", "localhost.localdomain"}
            or image_host.endswith((".internal", ".local", ".test"))
            or private_address or image_parsed.username or image_parsed.password
        ):
            raise AppException(
                code=ErrorCode.SYS_003,
                message="Product metadata is missing or contains an invalid image link.",
                status_code=422,
            )

        category = "clothing"
        name = title.lower()
        if any(word in name for word in ("shoe", "boot", "sneaker", "loafer")):
            category = "footwear"
        elif any(word in name for word in ("watch", "bag", "tie", "glasses", "belt")):
            category = "accessories"

        return {
            "product_url": product_url,
            "product_name": title,
            "brand": hostname.removeprefix("www.").split(".")[0].title(),
            "image_url": image_url,
            "category": category,
            "formality": "Business Casual",
            "source_type": "online_import",
        }
