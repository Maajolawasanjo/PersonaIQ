import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_sign_up_success(client: AsyncClient):
    payload = {
        "email": "test@personaiq.ai",
        "password": "Password123!",
        "first_name": "Jane",
        "last_name": "Doe",
    }
    response = await client.post("/api/v1/auth/sign-up", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert "refresh_token" in data["data"]
    assert data["data"]["user"]["email"] == "test@personaiq.ai"
    assert data["data"]["user"]["first_name"] == "Jane"
    assert data["data"]["user"]["onboarding_completed"] is False


@pytest.mark.asyncio
async def test_duplicate_email_signup_fails(client: AsyncClient):
    payload = {
        "email": "duplicate@personaiq.ai",
        "password": "Password123!",
        "first_name": "John",
        "last_name": "Doe",
    }
    res1 = await client.post("/api/v1/auth/sign-up", json=payload)
    assert res1.status_code == 201

    res2 = await client.post("/api/v1/auth/sign-up", json=payload)
    assert res2.status_code == 400
    data = res2.json()
    assert data["success"] is False
    assert data["error"]["code"] == "USER_002"


@pytest.mark.asyncio
async def test_sign_in_success(client: AsyncClient):
    signup_payload = {
        "email": "signin@personaiq.ai",
        "password": "Password123!",
        "first_name": "Alice",
        "last_name": "Smith",
    }
    await client.post("/api/v1/auth/sign-up", json=signup_payload)

    signin_payload = {
        "email": "signin@personaiq.ai",
        "password": "Password123!",
    }
    response = await client.post("/api/v1/auth/sign-in", json=signin_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]


@pytest.mark.asyncio
async def test_sign_in_invalid_password_fails(client: AsyncClient):
    signup_payload = {
        "email": "invalidpw@personaiq.ai",
        "password": "Password123!",
        "first_name": "Bob",
        "last_name": "Jones",
    }
    await client.post("/api/v1/auth/sign-up", json=signup_payload)

    signin_payload = {
        "email": "invalidpw@personaiq.ai",
        "password": "WrongPassword!",
    }
    response = await client.post("/api/v1/auth/sign-in", json=signin_payload)
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "AUTH_001"


@pytest.mark.asyncio
async def test_get_me_protected_route(client: AsyncClient):
    signup_payload = {
        "email": "me@personaiq.ai",
        "password": "Password123!",
        "first_name": "MeUser",
        "last_name": "Testing",
    }
    res = await client.post("/api/v1/auth/sign-up", json=signup_payload)
    access_token = res.json()["data"]["access_token"]

    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = await client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200

    me_data = me_response.json()
    assert me_data["success"] is True
    assert me_data["data"]["email"] == "me@personaiq.ai"


@pytest.mark.asyncio
async def test_complete_onboarding(client: AsyncClient):
    signup_payload = {
        "email": "onboarding@personaiq.ai",
        "password": "Password123!",
        "first_name": "New",
        "last_name": "User",
    }
    res = await client.post("/api/v1/auth/sign-up", json=signup_payload)
    access_token = res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    onboarding_payload = {
        "first_name": "UpdatedFirst",
        "last_name": "UpdatedLast",
        "occupation": "Senior Architect",
        "default_event_type": "Interview",
    }
    ob_res = await client.patch("/api/v1/profile/onboarding", json=onboarding_payload, headers=headers)
    assert ob_res.status_code == 200

    ob_data = ob_res.json()
    assert ob_data["success"] is True
    assert ob_data["data"]["onboarding_completed"] is True
    assert ob_data["data"]["first_name"] == "UpdatedFirst"
    assert ob_data["data"]["occupation"] == "Senior Architect"
