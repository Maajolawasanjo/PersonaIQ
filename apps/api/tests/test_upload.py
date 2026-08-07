import io
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_selfie_upload_success(client: AsyncClient):
    # 1. User Auth & Journey Setup
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "selfie_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Selfie",
            "last_name": "Test",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Selfie Test Journey"}, headers=headers
    )
    journey_id = journey_res.json()["data"]["id"]

    # 2. Upload Dummy JPEG Selfie
    dummy_jpeg = b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB\x00C\x00"
    files = {"file": ("test_selfie.jpg", io.BytesIO(dummy_jpeg), "image/jpeg")}
    data = {"journey_id": journey_id}

    res = await client.post(
        "/api/v1/uploads/selfie", data=data, files=files, headers=headers
    )
    assert res.status_code == 201
    body = res.json()

    assert body["success"] is True
    assert body["data"]["journey_id"] == journey_id
    assert body["data"]["mime_type"] == "image/jpeg"
    assert body["data"]["processing_status"] == "COMPLETED"
    assert "/media/uploads/selfies/" in body["data"]["storage_url"]


@pytest.mark.asyncio
async def test_outfits_upload_success(client: AsyncClient):
    # 1. User Auth & Journey Setup
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "outfits_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Outfit",
            "last_name": "Test",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Outfit Test Journey"}, headers=headers
    )
    journey_id = journey_res.json()["data"]["id"]

    # 2. Upload 2 Dummy PNG Outfits
    dummy_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    files = [
        ("files", ("outfit_1.png", io.BytesIO(dummy_png), "image/png")),
        ("files", ("outfit_2.png", io.BytesIO(dummy_png), "image/png")),
    ]
    data = {"journey_id": journey_id}

    res = await client.post(
        "/api/v1/uploads/outfits", data=data, files=files, headers=headers
    )
    assert res.status_code == 201
    body = res.json()

    assert body["success"] is True
    assert len(body["data"]["outfits"]) == 2
    assert body["data"]["outfits"][0]["display_order"] == 1
    assert body["data"]["outfits"][1]["display_order"] == 2


@pytest.mark.asyncio
async def test_upload_invalid_mime_type_fails(client: AsyncClient):
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "invalid_mime@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Invalid",
            "last_name": "Mime",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Mime Failure Journey"}, headers=headers
    )
    journey_id = journey_res.json()["data"]["id"]

    # Upload PDF file instead of Image
    files = {"file": ("document.pdf", io.BytesIO(b"%PDF-1.4..."), "application/pdf")}
    data = {"journey_id": journey_id}

    res = await client.post(
        "/api/v1/uploads/selfie", data=data, files=files, headers=headers
    )
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "UPLOAD_001"


@pytest.mark.asyncio
async def test_upload_oversized_file_fails(client: AsyncClient):
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "oversized@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Over",
            "last_name": "Sized",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Oversized Journey"}, headers=headers
    )
    journey_id = journey_res.json()["data"]["id"]

    # Upload 11 MB dummy file
    oversized_bytes = b"0" * (11 * 1024 * 1024)
    files = {"file": ("large.jpg", io.BytesIO(oversized_bytes), "image/jpeg")}
    data = {"journey_id": journey_id}

    res = await client.post(
        "/api/v1/uploads/selfie", data=data, files=files, headers=headers
    )
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "UPLOAD_002"
