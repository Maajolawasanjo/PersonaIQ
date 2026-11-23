import pytest
from pydantic import ValidationError
from app.core.config import Settings


def test_production_rejects_repository_default_jwt_secret():
    with pytest.raises(ValidationError, match="Production SECRET_KEY"):
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="personaiq-super-secret-development-jwt-key-2026",
        )


def test_production_cors_excludes_localhost_and_accepts_trusted_frontend():
    settings = Settings(
        ENVIRONMENT="production",
        SECRET_KEY="unit-test-only-strong-random-secret-for-production-validation",
        FRONTEND_URL="https://personaiq-web.vercel.app",
    )
    assert "http://localhost:3000" not in settings.allowed_cors_origins
    assert "https://personaiq-web.vercel.app" in settings.allowed_cors_origins
