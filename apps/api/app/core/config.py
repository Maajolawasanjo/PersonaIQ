from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # Application Identity
    APP_NAME: str = "PersonaIQ Backend API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Security & Authentication
    SECRET_KEY: str = "personaiq-super-secret-development-jwt-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database Connection
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/personaiq"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_RECYCLE: int = 1800

    # AI Provider Configurations
    FEATHERLESS_API_KEY: str = ""
    FEATHERLESS_BASE_URL: str = "https://api.featherless.ai/v1"
    FEATHERLESS_DEFAULT_MODEL: str = "meta-llama/Llama-3.3-70B-Instruct"

    YOUCAM_API_KEY: str = ""
    YOUCAM_SECRET_KEY: str = ""
    YOUCAM_BASE_URL: str = "https://api.perfectcorp.com/v1"

    # Storage Configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Feature Flags
    ENABLE_YOUCAM_VTO: bool = True
    ENABLE_SKIN_ANALYSIS: bool = True
    ENABLE_PDF_EXPORT: bool = True
    ENABLE_EMAIL_NOTIFICATIONS: bool = True

    # Email SMTP Configuration
    # NOTE: For Gmail, EMAILS_FROM_EMAIL MUST equal SMTP_USER to pass SPF and avoid bounces.
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""   # Leave blank — email_service.py enforces SMTP_USER for Gmail
    EMAILS_FROM_NAME: str = "PersonaIQ"

    # Frontend URL — used in email CTAs and password reset links
    # Local dev: http://localhost:3000
    # Production: https://personaiq-web.vercel.app
    FRONTEND_URL: str = "http://localhost:3000"

    # Email: Dev/Test settings
    EMAIL_TEST_RECIPIENT: str = ""   # Set in Render env vars to your inbox
    EMAIL_SUPPORT_URL: str = "https://personaiq.com/support"


settings = Settings()
