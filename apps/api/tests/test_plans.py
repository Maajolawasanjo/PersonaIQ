import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_presence_plans_and_boosts(client: AsyncClient, auth_headers: dict):
    # 1. List Plans
    plans_res = await client.get("/api/v1/plans", headers=auth_headers)
    assert plans_res.status_code == 200
    data = plans_res.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

    # 2. Create a Journey & fetch boosts
    journey_res = await client.post(
        "/api/v1/journeys",
        json={"title": "Presence Plan Journey"},
        headers=auth_headers
    )
    assert journey_res.status_code == 201
    journey_id = journey_res.json()["data"]["id"]

    boosts_res = await client.get(f"/api/v1/plans/{journey_id}/boosts", headers=auth_headers)
    assert boosts_res.status_code == 200
    boosts_data = boosts_res.json()
    assert boosts_data["success"] is True
    assert "boosters" in boosts_data["data"]
