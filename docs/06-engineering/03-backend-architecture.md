# PersonaIQ
# Backend Architecture

**Document ID:** PIQ-ENG-003  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Backend Engineering  

---

# Purpose
This document defines the backend architecture for PersonaIQ.
The backend is responsible for:
- Authentication
- Journey orchestration
- AI orchestration
- Business logic
- Recommendation generation
- Persistence
- Security
- API contracts

The backend must remain independent of any frontend framework.

---

# Architectural Philosophy
PersonaIQ follows Domain-Driven Design (DDD) principles.
Business logic is organized by business capability rather than technical layer.
Every domain owns: DTOs, Services, Validation, Business Rules, API Endpoints.
Controllers remain thin.

---

# Core Architectural Principles

## Principle 1: Thin Controllers
Controllers never contain business logic.
Controllers only: Authenticate requests, Validate DTOs, Call services, Return responses.
Maximum controller complexity should remain minimal.

## Principle 2: Service-Oriented Domain Layer
Every business capability belongs inside its own service.
*Examples:* AuthenticationService, JourneyService, PresenceService, SkinAnalysisService, VirtualTryOnService, RecommendationService, HistoryService, ExportService, NotificationService, AnalyticsService.

## Principle 3: One Screen → One API → One DTO
Every primary UI screen should communicate with one primary endpoint.
*Example:* Dashboard ↓ GET `/dashboard` ↓ `DashboardDTO`
This minimizes frontend orchestration and keeps APIs predictable.

## Principle 4: No AI Logic Inside Controllers
Controllers never call Gemini or YouCam directly.
*Instead:* Controller ↓ AIOrchestrationService ↓ Provider Adapter ↓ Response Normalizer ↓ DTO.

## Principle 5: Provider Isolation
External services must never leak into business logic.
*Wrong:* JourneyService ↓ YouCam API
*Correct:* JourneyService ↓ SkinAnalysisService ↓ SkinProvider Interface ↓ YouCamAdapter

---

# High-Level Backend Architecture

```text
                    HTTP Request
                          │
                          ▼
                FastAPI Router Layer
                          │
                          ▼
                 Authentication Middleware
                          │
                          ▼
                  Request Validation
                          │
                          ▼
                 Domain Controller
                          │
                          ▼
                  Domain Service
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
 Repository Layer   AI Services     Storage Service
         │                │                │
         ▼                ▼                ▼
 PostgreSQL       YouCam/Gemini      Object Storage
```

---

# Domain Structure
- **Authentication:** Users, Sessions, OAuth, JWT, Permissions
- **Journey:** Journey creation, Journey lifecycle, Progress, Completion, History
- **Presence:** Presence Index™, Presence scoring, Readiness calculations, Context aggregation
- **Skin Intelligence:** Image validation, Skin analysis, Normalization, Caching
- **Virtual Try-On:** Outfit uploads, VTO generation, Comparison, Ranking
- **Recommendations:** Prompt creation, Gemini orchestration, Recommendation generation, Checklist creation, Presence Plan generation
- **History:** Journey archive, Comparisons, Insights, Statistics
- **Export:** PDF generation, Image export, Sharing, Download history
- **Analytics:** Usage, Completion, Performance, System metrics

---

# Service Layer
Every service must be stateless. Services never store session data. Services communicate using DTOs only.
- **JourneyService:** Create, Update, Load, Delete, Complete journey.
- **PresenceService:** Calculate Presence Index™, Generate Presence Plan™, Calculate confidence, Merge AI outputs.
- **RecommendationService:** Generate recommendations, Generate checklist, Generate explanation, Prioritize actions.

---

# Repository Layer
Repositories are responsible for data access only. Never place business logic here.
- **JourneyRepository:** create(), update(), findById(), findByUser(), delete(), complete()
- **RecommendationRepository:** save(), history(), latest(), find()

---

# DTO Layer
Every endpoint returns a dedicated DTO. Never expose ORM models directly.
*Examples:* DashboardDTO, JourneyDTO, PresenceDTO, RecommendationDTO, HistoryDTO, SettingsDTO.

---

# Middleware
Authentication, Logging, Rate Limiting, Error Handling, Request ID, Response Timing, Security Headers, CORS, Compression.

---

# Validation
All requests validated using Pydantic. No controller should manually validate input.
*Examples:* CreateJourneyRequest, UploadSelfieRequest, UploadOutfitRequest, GeneratePresenceRequest.

---

# Error Handling
Centralized. Never expose internal stack traces.
Standard response:
```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "We couldn't process your image. Please try again."
  }
}
```

---

# AI Orchestration Service
The AI Orchestrator is the gateway for every AI request.
*Workflow:* JourneyService ↓ AIOrchestrator ↓ SkinAnalysisService ↓ VTOService ↓ PresenceService ↓ RecommendationService ↓ DTO.
The frontend never communicates with AI providers directly.

---

# Storage Architecture
- **PostgreSQL:** Stores Users, Journeys, Recommendations, Presence Plans, History, Metadata.
- **Object Storage:** Stores Selfies, Outfit images, Generated VTO images, Exports, Temporary assets. (Images are referenced by URL only).

---

# Authentication
- **Preferred Provider:** Clerk
- **Alternative:** Auth.js
- **Tokens:** JWT tokens for API authentication.
- **Roles:** Guest, User, Admin, Future Enterprise.

---

# API Versioning
All endpoints versioned (e.g., `/api/v1/`). Avoid breaking changes.

---

# Event Flow
User creates journey ↓ Journey created ↓ Image uploaded ↓ Skin analysis requested ↓ Skin results saved ↓ Outfits uploaded ↓ VTO generated ↓ Presence calculated ↓ Recommendations generated ↓ Presence Plan stored ↓ Journey completed.

---

# Performance Goals
Dashboard < 500 ms  
Journey creation < 300 ms  
Image upload < 2 s  
Skin analysis < 10 s  
Virtual Try-On < 12 s  
Presence Plan generation < 5 s  

---

# Scalability Strategy
Stateless API servers, Horizontal scaling, Provider abstraction, Background task support, CDN-backed asset delivery, Database indexing, Caching for repeated analyses.

---

# Future Expansion
The backend architecture must support:
- Multi-language support
- Enterprise organizations
- Team workspaces
- AI memory
- Calendar integration
- Wardrobe management
- Voice coaching
- Mobile applications
- GraphQL gateway
- Event-driven notifications

*These features should require new services rather than changes to existing domain boundaries.*

---

# Definition of Done
✓ Domain-driven architecture  
✓ Thin controllers  
✓ Service-oriented business logic  
✓ Provider abstraction  
✓ One Screen → One API → One DTO  
✓ Stateless services  
✓ Repository pattern  
✓ DTO-first API contracts  
✓ Enterprise scalability  
✓ Production-ready backend architecture
