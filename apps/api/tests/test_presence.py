import pytest
from httpx import AsyncClient
from app.domain.presence.scoring import PresenceScoringEngine, PresenceScoreResult


def test_pure_domain_presence_scoring_engine():
    # 1. High-importance executive event
    res1 = PresenceScoringEngine.calculate_presence_index(
        event_importance=5,
        dress_code="Executive Formal",
        skin_overall_score=90,
        outfit_alignment_scores=[88, 75],
    )
    assert isinstance(res1, PresenceScoreResult)
    assert 0 <= res1.overall_presence_index <= 100
    assert res1.executive_vibe_score == 92  # 88 + (5-3)*2
    assert res1.grooming_score == 90
    assert res1.outfit_alignment_score == 88

    # 2. Standard casual event
    res2 = PresenceScoringEngine.calculate_presence_index(
        event_importance=2,
        dress_code="Casual",
        skin_overall_score=70,
        outfit_alignment_scores=[65],
    )
    assert 0 <= res2.overall_presence_index <= 100
    assert res2.grooming_score == 70


@pytest.mark.asyncio
async def test_ai_analysis_and_presence_plan_generation(client: AsyncClient):
    # 1. Sign Up & Auth Header
    signup_res = await client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "presence_user@personaiq.ai",
            "password": "SecurePassword123!",
            "first_name": "Presence",
            "last_name": "Tester",
        },
    )
    token = signup_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Journey
    journey_res = await client.post(
        "/api/v1/journeys", json={"title": "Tech Summit Keynote"}, headers=headers
    )
    journey_id = journey_res.json()["data"]["id"]

    # 3. Patch Event Context
    await client.patch(
        f"/api/v1/journeys/{journey_id}/event",
        json={
            "industry": "Artificial Intelligence",
            "location": "San Francisco",
            "dress_code": "Executive Formal",
            "importance": 5,
        },
        headers=headers,
    )

    # 4. Trigger AI Analysis
    analyze_res = await client.post(
        f"/api/v1/journeys/{journey_id}/analyze", headers=headers
    )
    assert analyze_res.status_code == 200
    body = analyze_res.json()

    assert body["success"] is True
    plan = body["data"]
    assert plan["journey_id"] == journey_id
    assert 0 <= plan["overall_presence_index"] <= 100
    assert plan["executive_vibe_score"] > 0
    assert len(plan["recommendations"]) >= 3
    assert len(plan["checklist"]) >= 3

    # 5. Fetch Presence Plan via GET
    get_plan_res = await client.get(
        f"/api/v1/journeys/{journey_id}/plan", headers=headers
    )
    assert get_plan_res.status_code == 200
    assert get_plan_res.json()["data"]["id"] == plan["id"]
