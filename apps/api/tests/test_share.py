import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_share_token_generation(client: AsyncClient, auth_headers: dict):
    # 1. Create a Journey first
    journey_res = await client.post(
        "/api/v1/journeys",
        json={"title": "Shareable Boardroom Presentation", "event_type": "Keynote"},
        headers=auth_headers
    )
    assert journey_res.status_code == 201
    journey_id = journey_res.json()["data"]["id"]

    # 2. Generate Share Token
    share_res = await client.post(
        "/api/v1/share",
        json={"journey_id": journey_id, "expires_in_days": 7},
        headers=auth_headers
    )
    assert share_res.status_code in [200, 201]
    share_data = share_res.json()
    assert share_data["success"] is True
    assert "token" in share_data["data"] or "share_url" in share_data["data"]
