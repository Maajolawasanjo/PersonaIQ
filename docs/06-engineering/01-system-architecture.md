# PersonaIQ
# System Architecture

**Document ID:** PIQ-ENG-001  
**Version:** 1.0  
**Status:** Approved  
**Owner:** Engineering Team  

---

# Purpose
This document defines the high-level architecture of PersonaIQ.
The architecture prioritizes:
- Simplicity
- Scalability
- AI-first workflows
- Fast development
- Enterprise-grade maintainability

The application must be modular enough to evolve beyond the hackathon into a production SaaS platform.

---

# Architectural Principles
PersonaIQ follows six architectural principles.

## Principle 1: AI-First
Artificial intelligence is not an add-on. It is the product.
Every major workflow is orchestrated around AI reasoning.

## Principle 2: Thin Controllers
Controllers should never contain business logic.
Controllers only:
- Validate requests
- Authenticate users
- Call services
- Return DTOs

## Principle 3: Service-Oriented Domain Layer
Every business capability belongs inside a dedicated service.
*Examples:* JourneyService, PresenceService, SkinService, OutfitService, RecommendationService, ExportService, NotificationService, AuthenticationService.

## Principle 4: One Screen ↓ One Endpoint ↓ One DTO
Every frontend page communicates with exactly one primary backend endpoint whenever possible.
This keeps the UI predictable and minimizes orchestration complexity.

## Principle 5: External AI Isolation
All third-party AI providers must be isolated behind adapter services.
Never allow frontend components to communicate directly with external APIs.

## Principle 6: Composable Architecture
Every feature should be independently deployable, testable, and replaceable.

---

# High-Level Architecture

```text
                        ┌──────────────────────────┐
                        │      User Browser        │
                        └────────────┬─────────────┘
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │ Next.js Frontend (App)   │
                        └────────────┬─────────────┘
                                     │
                           HTTPS / REST API
                                     │
                                     ▼
                  ┌────────────────────────────────┐
                  │ FastAPI Backend (API Gateway)  │
                  └────────────┬───────────────────┘
                               │
      ┌──────────────┬──────────┴──────────┬──────────────┐
      ▼              ▼                     ▼              ▼
 Journey Service  Skin Service    Outfit Service  Presence Service
      │              │                     │              │
      └──────────────┴──────────┬──────────┴──────────────┘
                                ▼
                    Recommendation Engine
                                │
              ┌─────────────────┼──────────────────┐
              ▼                 ▼                  ▼
        YouCam Skin AI     YouCam VTO        Gemini LLM
                                │
                                ▼
                         PostgreSQL Database
```

---

# System Layers

## Presentation Layer
- **Technology:** Next.js 15
- **Responsibilities:** Rendering, Routing, Forms, State hydration, Accessibility, Client interactions.

## API Layer
- **Technology:** FastAPI
- **Responsibilities:** Authentication, Validation, Routing, DTO generation, Error handling.

## Domain Layer
Contains all business logic.
- **Examples:** Journey Management, Presence Calculation, Recommendation Generation, History, Analytics, Exports.
*No HTTP code exists here.*

## AI Layer
Dedicated orchestration layer.
- **Responsibilities:** Calling YouCam APIs, Calling Gemini, Prompt construction, Response normalization, Retry logic, AI explainability.

## Data Layer
- **Technology:** PostgreSQL
- **ORM:** Prisma
- **Stores:** Users, Journeys, Uploads, Recommendations, Presence Plans, History, Analytics.

## Storage Layer
- **Stores:** Uploaded selfies, Outfit images, Generated reports, Temporary AI artifacts.
- **Tech:** Cloud object storage only.
*Never store binary files inside PostgreSQL.*

---

# External Services
- **Authentication:** Clerk (recommended)
- **AI Providers:** YouCam API, Gemini API
- **Storage:** Supabase Storage or Cloudflare R2
- **Database:** PostgreSQL
- **Deployment:** Vercel (Frontend), Render / Railway (Backend)

---

# Data Flow
User ↓ Creates Journey ↓ Uploads Selfie ↓ Image stored securely ↓ Skin Service requests YouCam Skin AI ↓ Response normalized ↓ User uploads outfits ↓ Outfit Service requests YouCam VTO ↓ Results returned ↓ Presence Service combines: Event Context, Skin Analysis, Outfit Rankings ↓ Recommendation Service builds structured prompt ↓ Gemini generates human-readable guidance ↓ Presence Plan generated ↓ Saved to database ↓ Returned to frontend.

---

# Design Goals
Fast first load, Stateless backend, Strong separation of concerns, Reusable services, AI provider abstraction, Future multi-model support, Scalable deployment, High maintainability.

---

# Future Expansion
The architecture should support:
- Voice coaching
- Hair recommendations
- Accessories
- Live camera mode
- Team accounts
- Enterprise dashboards
- AI memory
- Personalized learning
- Cross-device synchronization

*No architectural changes should be required to add these capabilities.*

---

# Definition of Done
✓ Modular service architecture  
✓ Thin controller layer  
✓ External AI abstraction  
✓ One Screen → One Endpoint → One DTO  
✓ AI-first workflow  
✓ Production-ready separation of concerns  
✓ Horizontally scalable  
✓ Ready for enterprise evolution  
