"""Regression tests: account closure must not strand stored photos."""
import io

import pytest

from app.core.errors import AppException, ErrorCode
from app.services.storage_service import StorageService


async def create_account_photo(client, auth_headers):
    journey = await client.post(
        "/api/v1/journeys",
        json={"title": "Account deletion storage test"},
        headers=auth_headers,
    )
    assert journey.status_code == 201
    journey_id = journey.json()["data"]["id"]

    uploaded = await client.post(
        "/api/v1/uploads/selfie",
        data={"journey_id": journey_id},
        files={
            "file": (
                "portrait.jpg",
                io.BytesIO(b"\\xff\\xd8\\xff\\xe0\\x00\\x10JFIF\\x00\\x01".decode("unicode_escape").encode("latin1")),
                "image/jpeg",
            )
        },
        headers=auth_headers,
    )
    assert uploaded.status_code == 201
    return uploaded.json()["data"]["storage_url"]


@pytest.mark.asyncio
async def test_account_deletion_aborts_when_photo_cleanup_fails(client, auth_headers, monkeypatch):
    reference = await create_account_photo(client, auth_headers)

    async def fail_cleanup(self, references, user_id):
        assert reference in references
        raise AppException(
            code=ErrorCode.SYS_002,
            message="Private media removal is unavailable.",
            status_code=503,
        )

    monkeypatch.setattr(StorageService, "delete_owned_uploads", fail_cleanup)
    response = await client.request(
        "DELETE", "/api/v1/profile/account",
        headers=auth_headers, json={"password": "Password123!"},
    )
    assert response.status_code == 503

    profile = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert profile.status_code == 200


@pytest.mark.asyncio
async def test_account_deletion_calls_private_media_cleanup(client, auth_headers, monkeypatch):
    reference = await create_account_photo(client, auth_headers)
    observed = []

    async def successful_cleanup(self, references, user_id):
        observed.extend(references)

    monkeypatch.setattr(StorageService, "delete_owned_uploads", successful_cleanup)
    response = await client.request(
        "DELETE", "/api/v1/profile/account",
        headers=auth_headers, json={"password": "Password123!"},
    )
    assert response.status_code == 200
    assert reference in observed

    profile = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert profile.status_code == 401


@pytest.mark.asyncio
async def test_account_deletion_rejects_incorrect_password(client, auth_headers, monkeypatch):
    cleanup_called = False

    async def cleanup(self, references, user_id):
        nonlocal cleanup_called
        cleanup_called = True

    monkeypatch.setattr(StorageService, "delete_owned_uploads", cleanup)
    response = await client.request(
        "DELETE", "/api/v1/profile/account",
        headers=auth_headers, json={"password": "incorrect-secret"},
    )
    assert response.status_code == 400
    assert cleanup_called is False
    current_user = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert current_user.status_code == 200


@pytest.mark.asyncio
async def test_account_deletion_requires_password(client, auth_headers):
    response = await client.request("DELETE", "/api/v1/profile/account", headers=auth_headers)
    assert response.status_code == 422
