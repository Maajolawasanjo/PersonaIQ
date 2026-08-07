import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_journey_success(client: AsyncClient):
    # 1. Sign Up User
    signup_payload = {
        "email": "journey_user@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "Jane",
        "last_name": "Doe",
    }
    signup_res = await client.post("/api/v1/auth/sign-up", json=signup_payload)
    assert signup_res.status_code == 201
    access_token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # 2. Initiate Journey
    create_payload = {"title": "Executive Interview"}
    res = await client.post("/api/v1/journeys", json=create_payload, headers=headers)
    assert res.status_code == 201
    body = res.json()

    assert body["success"] is True
    assert body["data"]["title"] == "Executive Interview"
    assert body["data"]["status"] == "DRAFT"
    assert body["data"]["current_step"] == 1
    assert body["data"]["event"]["name"] == "Executive Interview"
    assert body["data"]["event"]["importance"] == 3


@pytest.mark.asyncio
async def test_get_journey_and_update_event_context(client: AsyncClient):
    # 1. Sign Up & Auth
    signup_payload = {
        "email": "event_user@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "Alex",
        "last_name": "Smith",
    }
    signup_res = await client.post("/api/v1/auth/sign-up", json=signup_payload)
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Journey
    create_res = await client.post(
        "/api/v1/journeys", json={"title": "Keynote Address"}, headers=headers
    )
    journey_id = create_res.json()["data"]["id"]

    # 3. Get Journey
    get_res = await client.get(f"/api/v1/journeys/{journey_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == journey_id

    # 4. Update Event Context
    update_payload = {
        "industry": "Artificial Intelligence",
        "location": "San Francisco, CA",
        "event_date": "2026-09-15",
        "event_time": "10:00 AM",
        "dress_code": "Smart Casual",
        "importance": 5,
    }
    patch_res = await client.patch(
        f"/api/v1/journeys/{journey_id}/event",
        json=update_payload,
        headers=headers,
    )
    assert patch_res.status_code == 200
    updated_data = patch_res.json()["data"]

    assert updated_data["current_step"] == 2
    assert updated_data["event"]["industry"] == "Artificial Intelligence"
    assert updated_data["event"]["location"] == "San Francisco, CA"
    assert updated_data["event"]["dress_code"] == "Smart Casual"
    assert updated_data["event"]["importance"] == 5


@pytest.mark.asyncio
async def test_journey_access_denied_for_other_user(client: AsyncClient):
    # 1. Sign Up User 1 & Create Journey
    user1_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "user1@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "User",
            "last_name": "One",
        },
    )
    headers1 = {"Authorization": f"Bearer {user1_res.json()['data']['access_token']}"}
    create_res = await client.post(
        "/api/v1/journeys", json={"title": "Private Journey"}, headers=headers1
    )
    journey_id = create_res.json()["data"]["id"]

    # 2. Sign Up User 2
    user2_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "user2@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "User",
            "last_name": "Two",
        },
    )
    headers2 = {"Authorization": f"Bearer {user2_res.json()['data']['access_token']}"}

    # 3. User 2 attempts to fetch User 1's journey
    get_res = await client.get(f"/api/v1/journeys/{journey_id}", headers=headers2)
    assert get_res.status_code == 404
    assert get_res.json()["error"]["code"] == "JOURNEY_001"
