from conftest import signup_and_verify
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_dashboard_overview(client: AsyncClient):
    # 1. Sign Up User
    signup_res = await signup_and_verify(client, {
            "email": "dash_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Dash",
            "last_name": "Board",
        })
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
    signup_res = await signup_and_verify(client, {
            "email": "list_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "List",
            "last_name": "Tester",
        })
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


@pytest.mark.asyncio
async def test_dashboard_has_no_fabricated_improvement_or_presence_score(client: AsyncClient):
    verified = await signup_and_verify(client, {
        "email": "dashboard-honesty@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "Verified",
        "last_name": "Owner",
    })
    token = verified.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    empty = (await client.get("/api/v1/dashboard", headers=headers)).json()["data"]
    assert empty["presence_index_avg"] is None
    assert "trend" not in empty["quick_stats"]
    assert empty["recent_journeys"] == []

    new = await client.post("/api/v1/journeys", json={"title": "Real Event"}, headers=headers)
    assert new.status_code == 201
    data = (await client.get("/api/v1/dashboard", headers=headers)).json()["data"]
    assert data["total_journeys_count"] == 1
    assert data["completed_journeys_count"] == 0
    assert data["recent_journeys"][0]["title"] == "Real Event"
    assert data["recent_journeys"][0]["id"] == new.json()["data"]["id"]
    assert "trend" not in data["quick_stats"]


@pytest.mark.asyncio
async def test_dashboard_only_lists_owned_journeys_and_excludes_archived_as_active(client: AsyncClient):
    first = await signup_and_verify(client, {
        "email": "dashboard-a@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "First",
        "last_name": "Owner",
    })
    a = {"Authorization": "Bearer " + first.json()["data"]["access_token"]}
    created = await client.post("/api/v1/journeys", json={"title": "Owner A"}, headers=a)
    journey_id = created.json()["data"]["id"]
    await client.post(f"/api/v1/journeys/{journey_id}/archive", headers=a)
    archived = (await client.get("/api/v1/dashboard", headers=a)).json()["data"]
    assert archived["active_journey"] is None
    assert archived["total_journeys_count"] == 1
    assert archived["recent_journeys"][0]["status"] == "ARCHIVED"

    second = await signup_and_verify(client, {
        "email": "dashboard-b@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "Second",
        "last_name": "Owner",
    })
    b = {"Authorization": "Bearer " + second.json()["data"]["access_token"]}
    another = (await client.get("/api/v1/dashboard", headers=b)).json()["data"]
    assert another["total_journeys_count"] == 0
    assert another["recent_journeys"] == []


@pytest.mark.asyncio
async def test_archived_journeys_stay_in_history_but_not_active(client: AsyncClient, auth_headers):
    titles = ["Draft One", "Draft Two", "Draft Three"]
    ids = []
    for title in titles:
        response = await client.post(
            "/api/v1/journeys", json={"title": title}, headers=auth_headers
        )
        assert response.status_code == 201
        ids.append(response.json()["data"]["id"])

    archived = await client.post(
        f"/api/v1/journeys/{ids[2]}/archive", headers=auth_headers
    )
    assert archived.status_code == 200

    first_page = await client.get(
        "/api/v1/journeys?page=1&page_size=2", headers=auth_headers
    )
    assert first_page.status_code == 200
    assert first_page.json()["pagination"]["total_items"] == 3
    assert first_page.json()["pagination"]["total_pages"] == 2
    assert len(first_page.json()["data"]) == 2

    second_page = await client.get(
        "/api/v1/journeys?page=2&page_size=2", headers=auth_headers
    )
    assert len(second_page.json()["data"]) == 1
    archived_only = await client.get(
        "/api/v1/journeys?status=ARCHIVED", headers=auth_headers
    )
    assert archived_only.json()["pagination"]["total_items"] == 1
    assert archived_only.json()["data"][0]["id"] == ids[2]

    overview = await client.get("/api/v1/dashboard", headers=auth_headers)
    assert overview.status_code == 200
    assert overview.json()["data"]["active_journey"]["id"] in ids[:2]


@pytest.mark.asyncio
async def test_soft_deleted_journey_is_absent_from_overview_history_and_details(
    client: AsyncClient, db_session, auth_headers: dict
):
    from uuid import UUID
    from datetime import datetime, timezone
    from app.models.journey import Journey

    response = await client.post(
        "/api/v1/journeys",
        json={"title": "Deleted draft"},
        headers=auth_headers,
    )
    journey_id = response.json()["data"]["id"]
    saved = await db_session.get(Journey, UUID(journey_id))
    saved.deleted_at = datetime.now(timezone.utc)
    await db_session.flush()

    overview = await client.get("/api/v1/dashboard", headers=auth_headers)
    assert overview.status_code == 200
    data = overview.json()["data"]
    assert data["total_journeys_count"] == 0
    assert data["active_journey"] is None
    assert data["recent_journeys"] == []

    history = await client.get("/api/v1/journeys", headers=auth_headers)
    assert history.status_code == 200
    assert history.json()["pagination"]["total_items"] == 0

    detail = await client.get(f"/api/v1/journeys/{journey_id}", headers=auth_headers)
    assert detail.status_code == 404
