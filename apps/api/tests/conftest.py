
import sys
import os
os.environ["ENVIRONMENT"] = "testing"
os.environ["ENABLE_EMAIL_NOTIFICATIONS"] = "false"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_secret_key_environment_testing_2026"
os.environ["SMTP_USER"] = "mock_user@personaiq.ai"
os.environ["SMTP_PASSWORD"] = "mock_password_123"

from pathlib import Path
from typing import AsyncGenerator
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

# Add apps/api root to sys.path
api_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(api_root))

from app.core.database import Base, get_db
import app.models  # Ensure ORM models register with Base.metadata
from app.main import app

# Shared in-memory SQLite database for test session
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = async_sessionmaker(
    bind=test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest_asyncio.fixture(autouse=True)
async def prepare_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


verification_codes: dict[str, str] = {}


@pytest.fixture(autouse=True)
def capture_verification_email(monkeypatch):
    from app.services.email_service import EmailService
    verification_codes.clear()

    async def send_verification(self, email, code):
        verification_codes[email.lower().strip()] = code
        return True

    monkeypatch.setattr(EmailService, "send_email_verification_email", send_verification)
    yield
    verification_codes.clear()


async def signup_and_verify(client: AsyncClient, payload: dict):
    signup = await client.post("/api/v1/auth/sign-up", json=payload)
    assert signup.status_code == 201, signup.text
    email = payload["email"].lower().strip()
    code = verification_codes[email]
    verified = await client.post(
        "/api/v1/auth/verify-otp",
        json={"email": email, "code": code},
    )
    assert verified.status_code == 200, verified.text
    return verified


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient) -> dict:
    signup_res = await signup_and_verify(
        client,
        {
            "email": "testuser@personaiq.com",
            "password": "Password123!",
            "first_name": "Test",
            "last_name": "User",
        },
    )
    data = signup_res.json()
    token = data["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
