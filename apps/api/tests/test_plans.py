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
    # Verified boosts are intentionally disabled. Returning fixed improvements
    # such as "+5% authority" would fabricate a personal assessment.
    assert boosts_res.status_code == 503
    boosts_data = boosts_res.json()
    assert boosts_data["success"] is False
    assert boosts_data["error"]["code"] == "AI_002"


@pytest.mark.asyncio
async def test_saved_plan_list_is_owner_scoped_and_has_no_unsupported_scores(
    client: AsyncClient, db_session, auth_headers: dict
):
    from uuid import UUID
    from app.models.presence import PresencePlan
    from conftest import signup_and_verify

    created = await client.post(
        "/api/v1/journeys", json={"title": "My Verified Event"}, headers=auth_headers
    )
    assert created.status_code == 201
    journey_id = created.json()["data"]["id"]
    plan = PresencePlan(
        journey_id=UUID(journey_id),
        overall_presence_index=91,
        executive_vibe_score=90,
        visual_impact_score=89,
        grooming_score=91,
        outfit_alignment_score=92,
        summary_narrative="Historical generated record",
    )
    db_session.add(plan)
    await db_session.flush()

    mine = await client.get("/api/v1/plans", headers=auth_headers)
    assert mine.status_code == 200
    entries = mine.json()["data"]
    assert len(entries) == 1
    assert entries[0]["journey_title"] == "My Verified Event"
    assert entries[0]["journey_status"] == "DRAFT"
    assert entries[0]["journey_id"] == journey_id
    assert "overall_presence_index" not in entries[0]
    assert "executive_vibe_score" not in entries[0]

    other = await signup_and_verify(client, {
        "email": "separate-plan-owner@personaiq.ai",
        "password": "SecurePassword123!",
        "first_name": "Second",
        "last_name": "Owner",
    })
    other_headers = {
        "Authorization": "Bearer " + other.json()["data"]["access_token"]
    }
    their_plans = await client.get("/api/v1/plans", headers=other_headers)
    assert their_plans.status_code == 200
    assert their_plans.json()["data"] == []
