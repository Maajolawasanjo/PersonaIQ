import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_user_settings_single_source_of_truth(client: AsyncClient, auth_headers: dict):
    # 1. Fetch current profile from auth/me
    get_res = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert get_res.status_code == 200
    user_data = get_res.json()["data"]

    # 2. Update profile
    update_res = await client.patch(
        "/api/v1/auth/profile",
        json={"first_name": "Alexander", "last_name": "Vance"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()["data"]
    assert updated_data["first_name"] == "Alexander"
    assert updated_data["last_name"] == "Vance"

    # 3. Verify single source of truth from /auth/me
    verify_res = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert verify_res.status_code == 200
    assert verify_res.json()["data"]["first_name"] == "Alexander"
