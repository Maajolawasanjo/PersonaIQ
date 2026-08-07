# PersonaIQ — Backend Foundation Specification & Contract

> **Document ID:** PIQ-ENG-014  
> **Status:** FROZEN FOR BACKEND CONSTRUCTION  
> **Target Stack:** FastAPI · PostgreSQL 17 · SQLAlchemy 2.0 (Async) · Pydantic v2 · Native JWT · Featherless AI Gateway  
> **Strict Mandate:** Zero Mock Data · Zero Hardcoded Stubs · Real Endpoints · Real AI Pipeline · Real Auth  

---

## 1. Frozen Technology Stack

| Layer | Selected Technology | Specification |
|---|---|---|
| **API Framework** | FastAPI (Python 3.12+) | Async controllers, OpenAPI 3.1 generation, Pydantic v2 native integration. |
| **ORM Layer** | SQLAlchemy 2.0 (Async) | Async engine (`asyncpg`), strict domain entity separation. |
| **Database** | PostgreSQL 17 | Primary storage, UUID v7 keys, JSONB for normalized metadata, B-tree indexes. |
| **Database Migrations** | Alembic | Version-controlled schema migrations (`alembic/versions/`). |
| **Validation & DTOs** | Pydantic v2 | `BaseModel` for request/response contracts, `BaseSettings` for env config. |
| **Authentication** | Native JWT + Refresh Tokens | Argon2id password hashing, access token (15m) + refresh token (7d) in DB. |
| **LLM Engine** | Featherless AI Gateway | OpenAI-compatible LLM Gateway (`LLMGateway`), provider-agnostic interface. |
| **Vision AI Engine** | YouCam PerfectCorp APIs | Isolated `VisionGateway` for Skin AI & Apparel VTO. |
| **Background Tasks** | FastAPI `BackgroundTasks` | Non-blocking execution for MVP (no Redis/Celery required in Phase 1). |
| **Object Storage** | Supabase Storage / S3 | Signed HTTPS URLs; binaries isolated from database. |
| **Testing & Quality** | Pytest · Ruff · Black | 100% async test suite (`pytest-asyncio`), automated linting and formatting. |

---

## 2. Directory Architecture (Clean Architecture Pattern)

```text
apps/api/
├── alembic/                  # Database migration scripts
│   └── versions/
├── app/
│   ├── api/                  # Route registrations & router mounting
│   ├── dependencies.py       # Global Dependency Injection factories
│   ├── main.py               # FastAPI application entry point & middleware stack
│   └── container.py          # Service & Gateway container setup
├── core/
│   ├── config.py             # Pydantic BaseSettings configuration & Feature Flags
│   ├── database.py           # Async SQLAlchemy session factory & engine
│   ├── security.py           # Argon2id hashing & JWT token handling
│   ├── errors.py             # Error code catalog (Enums) & HTTP exceptions
│   └── logging.py            # Structlog setup with X-Request-ID injection
├── domain/                   # PURE BUSINESS LOGIC (No database or web frameworks)
│   ├── presence/             # Proprietary Presence Index™ scoring engine (0-100)
│   ├── skin/                 # Skin analysis normalizer & metric scoring
│   ├── vto/                  # Outfit ranking & event alignment scoring
│   └── recommendations/      # Recommendation prioritization & explainability builder
├── dto/                      # Request & Response Contracts (Pydantic v2)
│   ├── common.py             # Standard API Response Envelope & Pagination DTOs
│   ├── auth.py               # Sign-up, sign-in, token refresh DTOs
│   ├── journey.py            # Journey lifecycle DTOs
│   ├── presence.py           # Presence Plan & Index breakdown DTOs
│   ├── upload.py             # Image upload & validation DTOs
│   └── user.py               # User profile & settings DTOs
├── middleware/
│   ├── request_id.py         # X-Request-ID & X-Correlation-ID middleware
│   ├── error_handler.py      # Standard response envelope exception catcher
│   └── auth.py               # Bearer JWT verification dependency
├── models/                   # SQLAlchemy 2.0 Async ORM Entities
│   ├── base.py               # Base class with UUID v7 PK generator
│   ├── user.py               # User, RefreshToken, UserPreference
│   ├── journey.py            # Journey, Event, JourneyEventLog (Event Sourcing Lite)
│   ├── upload.py             # SelfieUpload, OutfitUpload
│   ├── analysis.py           # SkinAnalysis, OutfitComparison (Versioned)
│   ├── presence.py           # PresencePlan, Recommendation, PreparationChecklist
│   └── audit.py              # AIRequestLog, AuditLog
├── providers/                # AI GATEWAY & EXTERNAL ADAPTERS
│   ├── gateway.py            # Unified AIGateway interface
│   ├── llm/                  # LLM Providers (Featherless, OpenAI, Gemini)
│   │   ├── base.py           # LLMProvider abstract interface
│   │   ├── featherless.py    # Featherless AI implementation (Primary)
│   │   └── mock.py           # Deterministic offline fallback provider
│   └── vision/               # Vision Providers (YouCam Skin & VTO)
│       ├── base.py           # VisionProvider abstract interface
│       ├── youcam_skin.py    # YouCam Skin AI implementation
│       └── youcam_vto.py     # YouCam Apparel VTO implementation
├── repositories/             # Database Access Layer (SQLAlchemy Async Queries)
│   ├── base.py               # Generic async repository pattern
│   ├── user.repository.py
│   ├── journey.repository.py
│   ├── presence.repository.py
│   └── audit.repository.py
├── services/                 # Application Services (Orchestrates domain & repositories)
│   ├── auth_service.py
│   ├── journey_service.py
│   ├── presence_service.py
│   ├── storage_service.py
│   └── ai_service.py
└── tests/                    # Pytest Async Test Suite
    ├── conftest.py
    ├── unit/
    └── integration/
```

---

## 3. Standard API Response Envelope & Error Catalog

### Success Response Envelope
All API endpoints return data wrapped in a unified envelope:
```json
{
  "success": true,
  "message": "Journey created successfully.",
  "data": {
    "id": "01912a4b-8c90-7123-89ab-cdef01234567",
    "title": "Software Engineering Interview",
    "status": "DRAFT"
  },
  "meta": {
    "request_id": "req_01912a4b-9000",
    "timestamp": "2026-08-06T16:45:00Z"
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password provided.",
    "details": null
  },
  "meta": {
    "request_id": "req_01912a4b-9000",
    "timestamp": "2026-08-06T16:45:00Z"
  }
}
```

### Error Code Catalog (Enum-Driven)

```python
class ErrorCode(str, Enum):
    # Authentication & Security
    AUTH_001 = "AUTH_001"  # Invalid credentials
    AUTH_002 = "AUTH_002"  # Token expired or invalid
    AUTH_003 = "AUTH_003"  # Account locked due to failed attempts
    AUTH_004 = "AUTH_004"  # Insufficient permissions
    
    # User Profile
    USER_001 = "USER_001"  # User not found
    USER_002 = "USER_002"  # Email already registered
    
    # Journey & Event
    JOURNEY_001 = "JOURNEY_001"  # Journey not found
    JOURNEY_002 = "JOURNEY_002"  # Invalid state transition
    JOURNEY_003 = "JOURNEY_003"  # Journey step validation failed
    
    # Uploads & Media
    UPLOAD_001 = "UPLOAD_001"  # Unsupported file format
    UPLOAD_002 = "UPLOAD_002"  # File size exceeds limit
    UPLOAD_003 = "UPLOAD_003"  # Face detection failed in image
    
    # AI Gateway
    AI_001 = "AI_001"  # Skin analysis provider unavailable
    AI_002 = "AI_002"  # Virtual Try-On generation failed
    AI_003 = "AI_003"  # LLM recommendation engine timeout
    AI_004 = "AI_004"  # Rate limit exceeded for AI provider
    
    # System
    SYS_001 = "SYS_001"  # Internal server error
    SYS_002 = "SYS_002"  # Service unavailable
    SYS_003 = "SYS_003"  # Validation error
```

---

## 4. Complete Database Schema (SQLAlchemy 2.0 with UUID v7)

Every table uses **UUID v7** (time-sortable, globally unique) and audit fields (`created_at`, `updated_at`, `deleted_at`).

```python
# models/user.py
class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(100))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512))
    occupation: Mapped[Optional[str]] = mapped_column(String(100))
    country: Mapped[Optional[str]] = mapped_column(String(100))
    timezone: Mapped[Optional[str]] = mapped_column(String(50), default="UTC")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    preference: Mapped[Optional["UserPreference"]] = relationship(back_populates="user", uselist=False)
    journeys: Mapped[list["Journey"]] = relationship(back_populates="user")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")


# models/journey.py
class Journey(Base):
    __tablename__ = "journeys"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True) # DRAFT, PROCESSING, COMPLETED, ARCHIVED
    current_step: Mapped[int] = mapped_column(Integer, default=1)
    
    active_presence_index: Mapped[Optional[int]] = mapped_column(Integer)
    active_confidence: Mapped[Optional[int]] = mapped_column(Integer)
    
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    user: Mapped["User"] = relationship(back_populates="journeys")
    event: Mapped[Optional["Event"]] = relationship(back_populates="journey", uselist=False)
    event_logs: Mapped[list["JourneyEventLog"]] = relationship(back_populates="journey")
    selfie_uploads: Mapped[list["SelfieUpload"]] = relationship(back_populates="journey")
    outfit_uploads: Mapped[list["OutfitUpload"]] = relationship(back_populates="journey")
    skin_analyses: Mapped[list["SkinAnalysis"]] = relationship(back_populates="journey")
    presence_plans: Mapped[list["PresencePlan"]] = relationship(back_populates="journey")


class JourneyEventLog(Base):
    """Event Sourcing Lite — Tracks timeline state transitions"""
    __tablename__ = "journey_event_logs"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    journey_id: Mapped[UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. JOURNEY_CREATED, SELFIE_UPLOADED, SKIN_ANALYZED
    payload: Mapped[Optional[dict]] = mapped_column(JSONB)
    correlation_id: Mapped[str] = mapped_column(String(100), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    journey: Mapped["Journey"] = relationship(back_populates="event_logs")


# models/analysis.py
class SkinAnalysis(Base):
    """Versioned Skin Intelligence Snapshots"""
    __tablename__ = "skin_analyses"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    journey_id: Mapped[UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    overall_score: Mapped[int] = mapped_column(Integer)
    hydration: Mapped[str] = mapped_column(String(50))
    oil_balance: Mapped[str] = mapped_column(String(50))
    redness: Mapped[str] = mapped_column(String(50))
    pores: Mapped[str] = mapped_column(String(50))
    texture: Mapped[str] = mapped_column(String(50))
    dark_circles: Mapped[str] = mapped_column(String(50))
    brightness: Mapped[str] = mapped_column(String(50))
    
    confidence: Mapped[int] = mapped_column(Integer)
    provider_name: Mapped[str] = mapped_column(String(50), default="YouCam")
    provider_version: Mapped[str] = mapped_column(String(50))
    canonical_payload: Mapped[dict] = mapped_column(JSONB, nullable=False) # Normalized schema
    
    processed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    journey: Mapped["Journey"] = relationship(back_populates="skin_analyses")


# models/presence.py
class PresencePlan(Base):
    """Versioned Presence Plan Snapshots"""
    __tablename__ = "presence_plans"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    journey_id: Mapped[UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), index=True, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    presence_index: Mapped[int] = mapped_column(Integer) # 0 - 100
    overall_confidence: Mapped[int] = mapped_column(Integer)
    appearance_score: Mapped[int] = mapped_column(Integer)
    style_score: Mapped[int] = mapped_column(Integer)
    context_score: Mapped[int] = mapped_column(Integer)
    preparation_score: Mapped[int] = mapped_column(Integer)
    professional_alignment_score: Mapped[int] = mapped_column(Integer)
    
    recommended_outfit_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True))
    summary: Mapped[str] = mapped_column(Text)
    reasoning: Mapped[str] = mapped_column(Text)
    algorithm_version: Mapped[str] = mapped_column(String(50), default="1.0.0")
    
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    journey: Mapped["Journey"] = relationship(back_populates="presence_plans")
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="presence_plan")


# models/audit.py
class AIRequestLog(Base):
    """Token & Cost Telemetry for Featherless & Vision APIs"""
    __tablename__ = "ai_request_logs"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    correlation_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    user_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), index=True)
    journey_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), index=True)
    
    provider: Mapped[str] = mapped_column(String(50), nullable=False) # Featherless, YouCam, OpenAI
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0)
    estimated_cost: Mapped[float] = mapped_column(Float, default=0.0) # USD cost
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    status_code: Mapped[int] = mapped_column(Integer, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
```

---

## 5. Provider-Agnostic AI Gateway Architecture

Every LLM request flows through a provider-agnostic interface (`LLMProvider`), allowing Featherless AI to be swapped or augmented without changing business code.

```python
# providers/llm/base.py
from abc import ABC, abstractmethod
from pydantic import BaseModel

class LLMRequest(BaseModel):
    prompt: str
    system_prompt: str
    temperature: float = 0.2
    max_tokens: int = 1500
    correlation_id: str

class LLMResponse(BaseModel):
    content: str
    prompt_tokens: int
    completion_tokens: int
    model: str
    provider: str
    latency_ms: int

class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, request: LLMRequest) -> LLMResponse:
        pass


# providers/llm/featherless.py
class FeatherlessLLMProvider(LLMProvider):
    """Primary LLM Provider using Featherless AI Gateway"""
    def __init__(self, api_key: str, base_url: str = "https://api.featherless.ai/v1"):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30.0
        )

    async def generate(self, request: LLMRequest) -> LLMResponse:
        start_time = time.time()
        response = await self.client.post("/chat/completions", json={
            "model": "meta-llama/Meta-Llama-3.1-70B-Instruct",
            "messages": [
                {"role": "system", "content": request.system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
        })
        latency_ms = int((time.time() - start_time) * 1000)
        data = response.json()
        
        return LLMResponse(
            content=data["choices"][0]["message"]["content"],
            prompt_tokens=data["usage"]["prompt_tokens"],
            completion_tokens=data["usage"]["completion_tokens"],
            model=data["model"],
            provider="Featherless",
            latency_ms=latency_ms
        )
```

---

## 6. Configurable Feature Flags & App Settings

```python
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Identity
    APP_NAME: str = "PersonaIQ API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security & Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str # postgresql+asyncpg://user:pass@localhost:5432/personaiq
    
    # AI Provider Keys
    FEATHERLESS_API_KEY: str = ""
    YOUCAM_API_KEY: str = ""
    
    # Storage
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Feature Flags
    ENABLE_YOUCAM_VTO: bool = True
    ENABLE_SKIN_ANALYSIS: bool = True
    ENABLE_PDF_EXPORT: bool = False
    ENABLE_EMAIL_NOTIFICATIONS: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

---

## 7. Phased MVP Scope Lock

```text
PHASE 1 — ESSENTIAL MVP (Current Focus)
├── Native Auth (Sign Up, Sign In, JWT, Refresh Token)
├── User Profile & Onboarding Completion
├── Journey Wizard (Event Setup, Context Parsing)
├── Selfie Upload & Quality Check
├── YouCam Skin Intelligence Normalization
├── Outfit Upload & VTO Comparison
├── Proprietary Presence Engine (0 - 100 Score)
├── Featherless AI LLM Recommendation Generator
└── Executive Dashboard (Active State & Zero State)

PHASE 2 — POST-MVP STABILITY
├── Journey History Timeline & Archival Search
├── User Settings & Preference Management
├── Error Telemetry & System Exception Guards
└── System Status & Health Check endpoints

PHASE 3 — FUTURE ROADMAP
├── PresenceDNA™ Style Radar Analytics
├── PDF / Image Report Export Service
├── Automated Storage Data Retention Purge
└── Real-Time Camera & Voice Analysis
```

---

## 8. Frozen Engineering Verification Plan

1. **Database Verification**: `alembic upgrade head` generates clean tables in PostgreSQL 17 with UUID v7 primary keys.
2. **Authentication Verification**: `POST /api/v1/auth/sign-up` creates user in DB; `POST /api/v1/auth/sign-in` returns valid access token; protected route rejects unauthenticated request with `401 Unauthorized`.
3. **AI Gateway Isolation Verification**: Swapping `FeatherlessLLMProvider` for `MockLLMProvider` allows the entire test suite to run offline without external API costs.
4. **End-to-End Test Verification**: `pytest` executes end-to-end user journey test without mock data.
