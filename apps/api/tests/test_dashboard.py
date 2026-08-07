import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_dashboard_overview(client: AsyncClient):
    # 1. Sign Up User
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "dash_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Dash",
            "last_name": "Board",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Initiate Active Journey
    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Dashboard Active Journey"}, headers=headers
    )
    active_id = journey_res.json()["data"]["id"]

    # 3. Fetch Dashboard Overview
    dash_res = await client.get("/api/v1/dashboard", headers=headers)
    assert dash_res.status_code == 200
    body = dash_res.json()

    assert body["success"] is True
    data = body["data"]
    assert data["active_journey"]["id"] == active_id
    assert data["total_journeys_count"] == 1
    assert data["completed_journeys_count"] == 0
    assert "status_summary" in data["quick_stats"]


@pytest.mark.asyncio
async def test_list_journeys_paginated_and_archive(client: AsyncClient):
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "list_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "List",
            "last_name": "Tester",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create 3 Journeys
    j1 = (await client.post("/api/v1/journeys", json={"title": "Journey 1"}, headers=headers)).json()["data"]["id"]
    j2 = (await client.post("/api/v1/journeys", json={"title": "Journey 2"}, headers=headers)).json()["data"]["id"]
    j3 = (await client.post("/api/v1/journeys", json={"title": "Journey 3"}, headers=headers)).json()["data"]["id"]

    # 1. Fetch Paginated List (Page 1, Size 2)
    list_res = await client.get("/api/v1/journeys?page=1&page_size=2", headers=headers)
    assert list_res.status_code == 200
    list_body = list_res.json()

    assert list_body["success"] is True
    assert len(list_body["data"]) == 2
    assert list_body["pagination"]["total_items"] == 3
    assert list_body["pagination"]["total_pages"] == 2

    # 2. Archive Journey 1
    archive_res = await client.post(f"/api/v1/journeys/{j1}/archive", headers=headers)
    assert archive_res.status_code == 200
    assert archive_res.json()["data"]["status"] == "ARCHIVED"

    # 3. Filter by ARCHIVED status
    archived_list = await client.get("/api/v1/journeys?status=ARCHIVED", headers=headers)
    assert archived_list.status_code == 200
    assert archived_list.json()["pagination"]["total_items"] == 1
    assert archived_list.json()["data"][0]["id"] == j1
