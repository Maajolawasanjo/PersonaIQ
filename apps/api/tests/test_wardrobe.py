from conftest import signup_and_verify
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_and_list_wardrobe_items(client: AsyncClient, auth_headers: dict):
    # 1. Create Wardrobe Item
    payload = {
        "name": "Navy Executive Blazer",
        "category": "Outerwear",
        "color": "Navy",
        "formality": "Formal",
        "photo_url": "https://example.com/blazer.jpg"
    }
    response = await client.post("/api/v1/wardrobe", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Navy Executive Blazer"
    assert data["data"]["category"] == "Outerwear"

    # 2. List Wardrobe Items
    list_res = await client.get("/api/v1/wardrobe", headers=auth_headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["success"] is True
    assert len(list_data["data"]) >= 1


@pytest.mark.asyncio
async def test_favorite_change_persists_and_is_scoped_to_owner(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/wardrobe",
        json={"name": "Tailored navy jacket", "category": "Outerwear"},
        headers=auth_headers,
    )
    assert created.status_code == 201
    item_id = created.json()["data"]["id"]

    favorite = await client.patch(
        f"/api/v1/wardrobe/{item_id}/favorite",
        json={"is_favorite": True},
        headers=auth_headers,
    )
    assert favorite.status_code == 200
    assert favorite.json()["data"]["is_favorite"] is True

    listing = await client.get("/api/v1/wardrobe", headers=auth_headers)
    assert next(i for i in listing.json()["data"] if i["id"] == item_id)["is_favorite"] is True

    # An authenticated second user cannot alter the first user's wardrobe.
    second = await signup_and_verify(client, {
            "email": "different_wardrobe_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Other",
            "last_name": "User",
        })
    second_token = second.json()["data"]["access_token"]
    forbidden = await client.patch(
        f"/api/v1/wardrobe/{item_id}/favorite",
        json={"is_favorite": False},
        headers={"Authorization": f"Bearer {second_token}"},
    )
    assert forbidden.status_code == 404

    unchanged = await client.get("/api/v1/wardrobe", headers=auth_headers)
    assert next(i for i in unchanged.json()["data"] if i["id"] == item_id)["is_favorite"] is True

    unfavorite = await client.patch(
        f"/api/v1/wardrobe/{item_id}/favorite",
        json={"is_favorite": False},
        headers=auth_headers,
    )
    assert unfavorite.status_code == 200
    assert unfavorite.json()["data"]["is_favorite"] is False


@pytest.mark.asyncio
async def test_outfits_persist_and_are_private(client: AsyncClient, auth_headers: dict):
    payload = {
        "name": "Interview blue suit",
        "image_url": "https://example.com/generated-look.png",
        "items": [{"id": "cloth-navy-suit-001", "name": "Navy suit"}],
    }
    created = await client.post("/api/v1/wardrobe/outfits", json=payload, headers=auth_headers)
    assert created.status_code == 201
    outfit_id = created.json()["data"]["id"]

    owned = await client.get("/api/v1/wardrobe/outfits", headers=auth_headers)
    assert owned.status_code == 200
    assert any(outfit["id"] == outfit_id for outfit in owned.json()["data"])

    second = await signup_and_verify(client, {"email": "another_outfit_owner@personaiq.ai", "password": "SecurePassword123!", "first_name": "Another", "last_name": "Owner"})
    token = second.json()["data"]["access_token"]
    other = await client.get("/api/v1/wardrobe/outfits", headers={"Authorization": f"Bearer {token}"})
    assert other.status_code == 200
    assert all(outfit["id"] != outfit_id for outfit in other.json()["data"])

    invalid = await client.post(
        "/api/v1/wardrobe/outfits",
        json={**payload, "image_url": "http://example.com/not-secure.png"},
        headers=auth_headers,
    )
    assert invalid.status_code == 422
