import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from conftest import signup_and_verify, verification_codes


def registration(email: str, password: str = "Password123!") -> dict:
    return {
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User",
    }


@pytest.mark.asyncio
async def test_signup_requires_email_verification(client: AsyncClient, db_session: AsyncSession):
    response = await client.post("/api/v1/auth/sign-up", json=registration("new@personaiq.ai"))
    assert response.status_code == 201
    payload = response.json()["data"]
    assert payload["email"] == "new@personaiq.ai"
    assert payload["verification_required"] is True
    assert "access_token" not in payload
    assert "refresh_token" not in payload

    user = (await db_session.execute(select(User).where(User.email == "new@personaiq.ai"))).scalar_one()
    assert user.is_verified is False
    assert user.otp_code != verification_codes["new@personaiq.ai"]
    assert len(user.otp_code) == 10


@pytest.mark.asyncio
async def test_duplicate_signup_is_rejected(client: AsyncClient):
    data = registration("duplicate@personaiq.ai")
    assert (await client.post("/api/v1/auth/sign-up", json=data)).status_code == 201
    second = await client.post("/api/v1/auth/sign-up", json=data)
    assert second.status_code == 400
    assert second.json()["error"]["code"] == "USER_002"


@pytest.mark.asyncio
async def test_unverified_user_cannot_sign_in(client: AsyncClient):
    data = registration("unverified@personaiq.ai")
    await client.post("/api/v1/auth/sign-up", json=data)
    result = await client.post("/api/v1/auth/sign-in", json={"email": data["email"], "password": data["password"]})
    assert result.status_code == 403
    assert result.json()["error"]["code"] == "AUTH_005"


@pytest.mark.asyncio
async def test_otp_verification_issues_single_session(client: AsyncClient, db_session: AsyncSession):
    email = "otp@personaiq.ai"
    await client.post("/api/v1/auth/sign-up", json=registration(email))
    code = verification_codes[email]
    invalid = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": "000000" if code != "000000" else "111111"})
    assert invalid.status_code == 400
    good = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": code})
    assert good.status_code == 200
    tokens = good.json()["data"]
    assert tokens["access_token"] and tokens["refresh_token"]
    assert tokens["user"]["is_verified"] is True
    replay = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": code})
    assert replay.status_code == 400
    me = await client.get("/api/v1/auth/me", headers={"Authorization": "Bearer " + tokens["access_token"]})
    assert me.status_code == 200


@pytest.mark.asyncio
async def test_wrong_otp_lockout_persists(client: AsyncClient, db_session: AsyncSession):
    email = "lockout@personaiq.ai"
    await client.post("/api/v1/auth/sign-up", json=registration(email))
    code = verification_codes[email]
    wrong = "000000" if code != "000000" else "111111"
    for attempt in range(5):
        failure = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": wrong})
        assert failure.status_code == 400
    locked = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": code})
    assert locked.status_code == 429
    db_session.expire_all()
    user = (await db_session.execute(select(User).where(User.email == email))).scalar_one()
    assert user.locked_until is not None


@pytest.mark.asyncio
async def test_resend_verification_after_cooldown(client: AsyncClient, db_session: AsyncSession):
    email = "resend@personaiq.ai"
    await client.post("/api/v1/auth/sign-up", json=registration(email))
    original_code = verification_codes[email]
    user = (await db_session.execute(select(User).where(User.email == email))).scalar_one()
    user.otp_expires_at = user.otp_expires_at.replace(year=user.otp_expires_at.year - 1)
    await db_session.flush()
    resent = await client.post("/api/v1/auth/resend-otp", json={"email": email})
    assert resent.status_code == 200
    assert verification_codes[email] != original_code
    verified = await client.post("/api/v1/auth/verify-otp", json={"email": email, "code": verification_codes[email]})
    assert verified.status_code == 200


@pytest.mark.asyncio
async def test_successful_login_after_verification(client: AsyncClient):
    data = registration("login@personaiq.ai")
    await signup_and_verify(client, data)
    signin = await client.post("/api/v1/auth/sign-in", json={"email": data["email"], "password": data["password"]})
    assert signin.status_code == 200
    assert signin.json()["data"]["user"]["is_verified"] is True


@pytest.mark.asyncio
async def test_invalid_password_cannot_sign_in(client: AsyncClient):
    data = registration("invalidpw@personaiq.ai")
    await signup_and_verify(client, data)
    invalid = await client.post("/api/v1/auth/sign-in", json={"email": data["email"], "password": "WrongPassword123!"})
    assert invalid.status_code == 401
    assert invalid.json()["error"]["code"] == "AUTH_001"


@pytest.mark.asyncio
async def test_onboarding_persists_profile_and_selection(client: AsyncClient):
    result = await signup_and_verify(client, registration("onboard@personaiq.ai"))
    token = result.json()["data"]["access_token"]
    headers = {"Authorization": "Bearer " + token}
    saved = await client.patch(
        "/api/v1/profile/onboarding",
        json={
            "first_name": "Updated",
            "last_name": "Account",
            "occupation": "Designer",
            "default_event_type": "Interview",
        },
        headers=headers,
    )
    assert saved.status_code == 200
    assert saved.json()["data"]["onboarding_completed"] is True
    profile = await client.get("/api/v1/auth/me", headers=headers)
    assert profile.status_code == 200
    assert profile.json()["data"]["onboarding_completed"] is True
    assert profile.json()["data"]["preference"]["default_event_type"] == "Interview"


@pytest.mark.asyncio
async def test_password_reset_revokes_old_session(client: AsyncClient, db_session: AsyncSession, monkeypatch):
    from app.services.email_service import EmailService
    sent_reset_tokens = []

    async def capture_reset(self, email, token):
        sent_reset_tokens.append(token)
        return True

    monkeypatch.setattr(EmailService, "send_password_reset_email", capture_reset)
    email = "recover@personaiq.ai"
    original = await signup_and_verify(client, registration(email, "OldPassword123!"))
    old_refresh = original.json()["data"]["refresh_token"]
    forgot = await client.post("/api/v1/auth/forgot-password", json={"email": email})
    assert forgot.status_code == 200
    user = (await db_session.execute(select(User).where(User.email == email))).scalar_one()
    assert len(sent_reset_tokens) == 1
    assert user.reset_token != sent_reset_tokens[0]
    assert len(user.reset_token) == 64
    reset = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": sent_reset_tokens[0], "new_password": "NewPassword123!"},
    )
    assert reset.status_code == 200
    revoked = await client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
    assert revoked.status_code == 401
    signin = await client.post("/api/v1/auth/sign-in", json={"email": email, "password": "NewPassword123!"})
    assert signin.status_code == 200


@pytest.mark.asyncio
async def test_email_diagnostic_endpoint_is_not_public(client: AsyncClient):
    res = await client.post("/api/v1/auth/test-email?template=all&to_email=someone@example.com")
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_login_attempt_lockout_is_persisted(client: AsyncClient, db_session: AsyncSession):
    data = registration("login-lock@personaiq.ai")
    await signup_and_verify(client, data)
    for _ in range(5):
        invalid = await client.post(
            "/api/v1/auth/sign-in",
            json={"email": data["email"], "password": "WrongPassword123!"},
        )
        assert invalid.status_code == 401
    locked = await client.post(
        "/api/v1/auth/sign-in",
        json={"email": data["email"], "password": data["password"]},
    )
    assert locked.status_code == 423
    db_session.expire_all()
    user = (await db_session.execute(select(User).where(User.email == data["email"]))).scalar_one()
    assert user.locked_until is not None


@pytest.mark.asyncio
async def test_reset_password_rejects_reused_token(client: AsyncClient, monkeypatch):
    from app.services.email_service import EmailService
    tokens = []

    async def capture_reset(self, email, token):
        tokens.append(token)
        return True

    monkeypatch.setattr(EmailService, "send_password_reset_email", capture_reset)
    email = "reset-replay@personaiq.ai"
    await signup_and_verify(client, registration(email))
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    assert tokens
    first = await client.post("/api/v1/auth/reset-password", json={
        "token": tokens[0], "new_password": "NewPassword123!",
    })
    assert first.status_code == 200
    replay = await client.post("/api/v1/auth/reset-password", json={
        "token": tokens[0], "new_password": "AnotherPass123!",
    })
    assert replay.status_code == 400


@pytest.mark.asyncio
async def test_password_change_revokes_refresh_session(client: AsyncClient):
    data = registration("change-pw@personaiq.ai", "OriginalPass123!")
    session = await signup_and_verify(client, data)
    headers = {"Authorization": "Bearer " + session.json()["data"]["access_token"]}
    original_refresh = session.json()["data"]["refresh_token"]
    changed = await client.post(
        "/api/v1/profile/change-password",
        json={"current_password": "OriginalPass123!", "new_password": "UpdatedPass123!"},
        headers=headers,
    )
    assert changed.status_code == 200
    expired = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": original_refresh}
    )
    assert expired.status_code == 401
    new_login = await client.post(
        "/api/v1/auth/sign-in",
        json={"email": data["email"], "password": "UpdatedPass123!"},
    )
    assert new_login.status_code == 200


@pytest.mark.asyncio
async def test_user_can_revoke_own_refresh_session(client: AsyncClient):
    data = registration("session-owner@personaiq.ai")
    verification = await signup_and_verify(client, data)
    token = verification.json()["data"]
    auth_headers = {"Authorization": "Bearer " + token["access_token"]}

    sessions = await client.get("/api/v1/profile/sessions", headers=auth_headers)
    assert sessions.status_code == 200
    records = sessions.json()["data"]
    assert isinstance(records, list) and len(records) >= 1

    revoked = await client.delete(
        "/api/v1/profile/sessions/" + records[0]["id"],
        headers=auth_headers,
    )
    assert revoked.status_code == 200
    assert revoked.json()["data"]["revoked"] is True

    cannot_refresh = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": token["refresh_token"]}
    )
    assert cannot_refresh.status_code == 401


@pytest.mark.asyncio
async def test_unverified_cannot_access_profile(client: AsyncClient):
    data = registration("pending-profile@personaiq.ai")
    registered = await client.post("/api/v1/auth/sign-up", json=data)
    assert registered.status_code == 201
    profile = await client.get("/api/v1/auth/me")
    assert profile.status_code in (401, 403)
