import io

import httpx
import pytest
from fastapi import UploadFile
from starlette.datastructures import Headers

from app.core.config import settings
from app.core.errors import AppException, ErrorCode
from app.services.storage_service import StorageService


def jpeg_file() -> UploadFile:
    return UploadFile(
        file=io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01"),
        filename="portrait.jpg",
        headers=Headers({"content-type": "image/jpeg"}),
    )


@pytest.mark.asyncio
async def test_live_upload_without_private_storage_fails_closed(monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "SUPABASE_URL", "")
    monkeypatch.setattr(settings, "SUPABASE_SERVICE_ROLE_KEY", "")
    service = StorageService(upload_dir=str(tmp_path))
    with pytest.raises(AppException) as exc:
        await service.validate_and_save(
            jpeg_file(), "selfies", "user-1", "journey-1"
        )
    assert exc.value.status_code == 503
    assert not list(tmp_path.rglob("*.jpg"))


@pytest.mark.asyncio
async def test_spoofed_content_type_is_rejected(monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "ENVIRONMENT", "testing")
    service = StorageService(upload_dir=str(tmp_path))
    file = UploadFile(
        file=io.BytesIO(b"\xff\xd8\xffnot-a-png"),
        filename="bad.png",
        headers=Headers({"content-type": "image/png"}),
    )
    with pytest.raises(AppException) as exc:
        await service.validate_and_save(file, "selfies", "user", "journey")
    assert exc.value.code == ErrorCode.UPLOAD_001


@pytest.mark.asyncio
async def test_public_supabase_bucket_is_rejected(monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    service = StorageService(upload_dir=str(tmp_path))
    service.supabase_url = "https://example.supabase.co"
    service.supabase_key = "test-server-only-secret"

    class PublicBucketClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def get(self, url, **kwargs):
            return httpx.Response(200, json={"id": service.bucket, "public": True})

    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: PublicBucketClient())
    with pytest.raises(AppException) as exc:
        await service.validate_and_save(
            jpeg_file(), "selfies", "user-1", "journey-1"
        )
    assert exc.value.status_code == 503
    assert not list(tmp_path.rglob("*.jpg"))


@pytest.mark.asyncio
async def test_media_signing_creates_temporary_private_url(monkeypatch):
    service = StorageService()
    service.supabase_url = "https://example.supabase.co"
    service.supabase_key = "test-server-only-secret"
    object_path = "selfies/user-1/image.jpg"

    class PrivateBucketClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def get(self, url, **kwargs):
            return httpx.Response(200, json={"public": False})
        async def post(self, url, **kwargs):
            assert kwargs["json"]["expiresIn"] == 300
            return httpx.Response(
                200,
                json={
                    "signedURL": "/object/sign/"
                    + service.bucket + "/" + object_path + "?token=test-temporary-token"
                },
            )

    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: PrivateBucketClient())
    result = await service.create_signed_download_url(
        "supabase://" + service.bucket + "/" + object_path
    )
    assert result.startswith("https://example.supabase.co/storage/v1/object/sign/")
    assert "test-temporary-token" in result
    assert "/object/public/" not in result


@pytest.mark.asyncio
async def test_untrusted_media_reference_cannot_be_signed():
    service = StorageService()
    with pytest.raises(AppException):
        await service.create_signed_download_url("https://example.com/private-photo.jpg")
