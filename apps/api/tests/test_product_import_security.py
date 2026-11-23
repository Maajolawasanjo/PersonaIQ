import pytest
from app.core.errors import AppException
from app.services.product_import.importer import validate_retailer_url, ProductImporter


@pytest.mark.parametrize("url", [
    "http://www.zara.com/product",
    "https://127.0.0.1/admin",
    "https://localhost:8000/api",
    "https://metadata.google.internal/secret",
    "https://zara.com.evil.example/product",
    "https://shop.zara.com/product",
    "https://zara.com:notaport/product",
    "https://user:pass@zara.com/product",
])
def test_import_rejects_untrusted_hosts_without_fetching(url):
    with pytest.raises(AppException):
        validate_retailer_url(url)


def test_import_allows_named_retailers():
    assert validate_retailer_url("https://www.zara.com/product") == "www.zara.com"


@pytest.mark.asyncio
async def test_import_rejects_unsafe_url_before_network():
    with pytest.raises(AppException):
        await ProductImporter().import_from_url("https://127.0.0.1/internal")
