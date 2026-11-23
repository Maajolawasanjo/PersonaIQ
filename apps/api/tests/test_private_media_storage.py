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


@pytest.mark.asyncio
async def test_preview_requires_owned_journey(client, auth_headers, monkeypatch):
    from app.services.storage_service import StorageService

    created = await client.post(
        "/api/v1/journeys",
        json={"title": "Private image"},
        headers=auth_headers,
    )
    journey_id = created.json()["data"]["id"]
    uploaded = await client.post(
        "/api/v1/uploads/selfie",
        data={"journey_id": journey_id},
        files={"file": ("portrait.jpg", jpeg_file().file, "image/jpeg")},
        headers=auth_headers,
    )
    assert uploaded.status_code == 201

    async def mock_sign(self, reference, expires_in=300):
        return "https://files.example.test/temporary-image"

    monkeypatch.setattr(StorageService, "create_signed_download_url", mock_sign)
    access = await client.get(
        "/api/v1/uploads/selfie/" + journey_id + "/preview",
        headers=auth_headers,
    )
    assert access.status_code == 200
    assert access.json()["data"]["expires_in"] == 300
    assert access.headers["cache-control"] == "private, no-store"

    denied = await client.get(
        "/api/v1/uploads/selfie/" + journey_id + "/preview",
    )
    assert denied.status_code in (401, 403)


def test_storage_deletion_rejects_other_users_reference():
    storage = StorageService()
    storage.supabase_url = "https://example.supabase.co"
    with pytest.raises(AppException):
        storage._owned_storage_key(
            "supabase://" + storage.bucket + "/selfies/another-account/photo.jpg",
            "my-account",
        )


@pytest.mark.asyncio
async def test_storage_deletion_uses_exact_paths(monkeypatch):
    storage = StorageService()
    storage.supabase_url = "https://example.supabase.co"
    storage.supabase_key = "unit-test-server-key"
    seen = []

    class DeleteClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def request(self, method, url, **kwargs):
            seen.append((method, url, kwargs["json"]))
            return httpx.Response(200, json=[])

    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: DeleteClient())
    ref = "supabase://" + storage.bucket + "/selfies/account-1/image.jpg"
    await storage.delete_owned_uploads([ref, ref], "account-1")
    assert len(seen) == 1
    assert seen[0][0] == "DELETE"
    assert seen[0][2]["prefixes"] == ["selfies/account-1/image.jpg"]


@pytest.mark.asyncio
async def test_storage_cleanup_failure_preserves_error(monkeypatch):
    storage = StorageService()
    storage.supabase_url = "https://example.supabase.co"
    storage.supabase_key = "unit-test-server-key"

    class ErrorClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def request(self, method, url, **kwargs):
            return httpx.Response(503, json={"error": "unavailable"})

    monkeypatch.setattr(httpx, "AsyncClient", lambda **kwargs: ErrorClient())
    with pytest.raises(AppException) as err:
        await storage.delete_owned_uploads(
            ["supabase://" + storage.bucket + "/outfits/account-1/image.png"],
            "account-1",
        )
    assert err.value.status_code == 503
