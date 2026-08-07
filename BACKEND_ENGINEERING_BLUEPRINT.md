# PersonaIQ — Master Backend Engineering Blueprint & Production Implementation Specification

> **Document ID:** PIQ-ENG-MASTER-001  
> **Status:** Production Architecture Blueprint — Frozen for Backend Implementation  
> **Target Architecture:** `apps/api` (FastAPI) + PostgreSQL + SQLAlchemy 2.0 / Pydantic v2 + `packages/ai-core`  
> **Strict Mandate:** Zero Mock Data · Zero Hardcoded Stubs · Real Endpoints · Real AI Pipeline · Real Auth  

---

## 1. Executive Summary & Core Mindset

PersonaIQ is transitioning from a visual prototype into a fully functional, production-ready SaaS application. Every interaction, modal, file upload, form submission, and AI calculation is backed by:
- **FastAPI** REST Endpoints (`/api/v1`)
- **PostgreSQL 17** relational persistence
- **Object Storage** (Supabase Storage / S3) for selfies, outfits, and exports
- **JWT Authentication** middleware
- **Multi-Model AI Orchestration Engine** (`packages/ai-core`) for YouCam Skin AI, YouCam Apparel VTO, and Gemini LLM.

---

## 2. Master Database Decision Matrix

For every data point across the 65 screens, the storage location and rationale are defined below:

| Data Type | Primary Location | Rationale & Lifecycle |
|---|---|---|
| **User Identity & Auth** | Database (`users` table) | Persistent, relational, security authority. |
| **User Preferences** | Database (`user_preferences` table) | Persistent, linked to User via 1:1 foreign key. |
| **Auth JWT Token** | Cookie (HttpOnly) / Header | Auth state preservation across browser sessions. |
| **Journey Metadata** | Database (`journeys`, `events` tables) | Core business entity. Relational integrity required. |
| **Uploaded Selfies & Outfits** | Object Storage (Supabase Storage / S3) | Binary storage isolation; DB stores only secure HTTPS URLs. |
| **Normalized Skin Analysis** | Database (`skin_analyses` table) | Normalized AI output. `raw_response` stored as JSONB. |
| **Virtual Try-On Output** | Database (`outfit_comparisons` table) + Object Storage | VTO image in Object Storage; metadata & rankings in DB. |
| **Presence Index & Plan** | Database (`presence_plans`, `recommendations`) | **Immutable snapshots**; versioned per calculation run. |
| **Preparation Checklist** | Database (`preparation_checklists` table) | Active state, user interactively checks items off. |
| **Theme / UI State** | Local Storage / Zustand | Fast client-side rendering without network overhead. |
| **Draft Form Data** | Session Storage / Local Storage | Form recovery across page refreshes before POST submit. |
| **AI Request Logs** | Database (`ai_request_logs` table) | Operational auditing, token tracking, latency analysis. |

---

## 3. Exhaustive Engineering Breakdown by Module (All 65 Screens)

---

### Module 01: Authentication & Onboarding (Screens 07–11, 13–15, 61)

1. **Screen Purpose**: Authenticate users, manage security boundaries, enforce lockout policies, handle password resets, verify emails, and guide first-time users through initial profile setup.
2. **User Actions**:
   - `POST /auth/sign-in` — Submit email/password.
   - `POST /auth/sign-up` — Create new account.
   - `POST /auth/verify-email` — Verify email OTP / magic token.
   - `POST /auth/forgot-password` — Request password reset email.
   - `POST /auth/reset-password` — Set new password with reset token.
   - `POST /auth/2fa` — Submit 2FA authentication code.
   - `PATCH /profile/onboarding` — Complete welcome onboarding sequence.
3. **Backend Services**:
   - `AuthenticationService` (JWT verification, session validation, password hashing/verification).
   - `SecurityService` (5-attempt lockout enforcement, 15-minute cooldown timer, rate limiting).
   - `NotificationService` (Email dispatch for verification and password reset tokens).
4. **Database Tables**:
   - `users` (`id`, `email`, `hashed_password`, `first_name`, `last_name`, `onboarding_completed`, `created_at`, `updated_at`).
   - `user_preferences` (`id`, `user_id`, `preferred_theme`, `default_event_type`, `notification_settings`).
5. **Storage Requirements**: Profile avatar uploads → `profiles/avatars/{user_id}.jpg` in Object Storage.
6. **API Endpoints & DTOs**:
   - `POST /api/v1/auth/sign-up` → Req: `SignUpRequest` | Res: `UserDTO`
   - `POST /api/v1/auth/sign-in` → Req: `SignInRequest` | Res: `AuthTokenDTO` (`access_token`, `token_type`, `user`)
   - `GET /api/v1/auth/me` → Req: `Bearer Token` | Res: `UserDTO`
   - `PATCH /api/v1/profile/onboarding` → Req: `OnboardingRequest` | Res: `UserDTO`
7. **Validation Rules**: Email must be valid RFC 5322. Password minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit. 5 failed logins trigger locked state (`/account-locked`) with 15-min cooldown.
8. **Business Logic**: Successful signup defaults `onboarding_completed: false`. Redirect flow: `/signup` → `/verify-email` → `/onboarding` → `/dashboard`.
9. **State Management**: Auth JWT & User DTO stored in Zustand `useAuthStore` + HttpOnly Cookie.
10. **Local Storage**: `personaiq_theme`, `personaiq_remember_me`. No sensitive tokens in unencrypted localStorage.
11. **AI Integration**: None in auth module.
12. **Third-Party Services**: Supabase Auth / Clerk (Identity), Resend / SendGrid (Transactional Email).
13. **Security**: Passwords hashed using Argon2id / bcrypt. CSRF protection, CORS, rate limit: 5 requests/minute on `/auth/sign-in`.
14. **Background Jobs**: Async email dispatch worker (`workers/email.py`).
15. **Error Handling**: Invalid credentials → `401 Unauthorized`. Account locked → `423 Locked`.
16. **Notifications**: Toast feedback for password reset; confirmation banner on onboarding completion.
17. **Analytics**: Events: `user_signed_up`, `user_logged_in`, `onboarding_completed`.
18. **Performance**: Index on `users.email` (<10ms lookup).
19. **Accessibility**: Visible labels, ARIA invalid states, 44x44px tap targets.

---

### Module 02: Executive Dashboard (Screens 12, 16, 32)

1. **Screen Purpose**: Mission Control hub displaying active presence scores, recent journeys, upcoming events, and zero-state CTA onboarding.
2. **User Actions**:
   - View active presence score & radar chart.
   - Toggle between "Active Dashboard" and "First-Time User (Zero State)".
   - Click `+ Start Journey` → routes to `/journey/start`.
   - Click `Resume Journey` → routes to active draft journey.
3. **Backend Services**: `DashboardService` (Aggregates journey counts, latest Presence Index, upcoming events, recent activities).
4. **Database Tables**: `journeys`, `presence_plans`, `events`, `recommendations`.
5. **Storage Requirements**: User profile avatar fetching.
6. **API Endpoints & DTOs**: `GET /api/v1/dashboard` → Req: `Bearer Token` | Res: `DashboardDTO`
7. **Validation Rules**: User must be authenticated (`401` redirect to `/login`).
8. **Business Logic**: If user has 0 journeys, return `DashboardDTO` with `is_zero_state: true`. Compute `active_presence_index` from the most recent completed `presence_plans` record.
9. **State Management**: React Query `useQuery(['dashboard'])` with 60s stale time.
10. **Local Storage**: Cache `lastViewedState` (Active vs Zero State).
11. **AI Integration**: None (displays pre-calculated AI outputs).
12. **Third-Party Services**: None.
13. **Security**: Bearer token authentication required. Row-Level Security (RLS) or tenant isolation filter (`user_id = current_user`).
14. **Background Jobs**: None.
15. **Error Handling**: Network error → retry banner; system error → standard 500 JSON.
16. **Notifications**: Top notification banner if active presence score dropped >5 points since last journey.
17. **Analytics**: Log `dashboard_viewed`.
18. **Performance**: Single SQL join query returning complete `DashboardDTO` in <100ms.
19. **Accessibility**: Full keyboard tab ordering across quick action cards.

---

### Module 03: Presence Journey — Context & Event Setup (Screens 17–21)

1. **Screen Purpose**: Initiate a new Presence Journey, gather event context (type, date, location, industry, dress code, importance).
2. **User Actions**:
   - Select event type (Interview, Pitch, Keynote, Networking, Wedding, etc.).
   - Input event name, date, time, location, importance slider (1–5).
   - Select target dress code (Business Formal, Business Casual, Smart Casual, Creative, etc.).
3. **Backend Services**: `JourneyService` (Creates `Journey` record in `DRAFT` status, updates `Event` context).
4. **Database Tables**:
   - `journeys` (`id`, `user_id`, `title`, `status: DRAFT`, `current_step`, `created_at`).
   - `events` (`id`, `journey_id`, `name`, `industry`, `location`, `date`, `time`, `dress_code`, `importance`).
5. **Storage Requirements**: None.
6. **API Endpoints & DTOs**:
   - `POST /api/v1/journeys` → Req: `CreateJourneyRequest` | Res: `JourneyDTO`
   - `PATCH /api/v1/journeys/{id}/event` → Req: `UpdateEventRequest` | Res: `JourneyDTO`
7. **Validation Rules**: `event_type` required. `event_date` must be today or in the future.
8. **Business Logic**: Creating a journey sets `current_step: 1`. Step increments as user completes wizard pages.
9. **State Management**: Zustand `useJourneyStore` holds current draft journey state.
10. **Local Storage**: Draft backup in `sessionStorage` in case of accidental tab closure.
11. **AI Integration**: `JourneyContextEngine` parses raw user input into normalized `Structured Event Profile JSON`.
12. **Third-Party Services**: None.
13. **Security**: Validate user ownership of `journey_id` on every `PATCH`.
14. **Background Jobs**: None.
15. **Error Handling**: `404 Not Found` if `journey_id` doesn't exist; `400 Bad Request` on invalid date format.
16. **Notifications**: Toast notification when journey draft is saved.
17. **Analytics**: Log `journey_started`, `event_context_saved`.
18. **Performance**: Fast insert (<30ms).
19. **Accessibility**: Radio button cards accessible via arrow keys.

---

### Module 04: Selfie Upload & Skin Intelligence (Screens 22–25)

1. **Screen Purpose**: Upload face selfie, validate image quality (lighting, face detection, resolution), run YouCam Skin AI, and render normalized skin intelligence metrics.
2. **User Actions**:
   - Drag & drop or take selfie photo.
   - Validate image checkmark status.
   - Trigger `Presence Scan™`.
   - View normalized skin metrics (hydration, texture, oil balance, dark circles, redness).
3. **Backend Services**:
   - `StorageService` (Uploads image to Object Storage bucket `selfies/`).
   - `SkinAnalysisService` (Calls YouCam Skin AI API, normalizes response, saves to database).
4. **Database Tables**:
   - `selfie_uploads` (`id`, `journey_id`, `storage_url`, `processing_status`, `uploaded_at`).
   - `skin_analyses` (`id`, `journey_id`, `overall_score`, `hydration`, `oil_balance`, `redness`, `pores`, `texture`, `dark_circles`, `brightness`, `confidence`, `raw_response`).
5. **Storage Requirements**: Object Storage Bucket `selfies` (authenticated signed URLs only).
6. **API Endpoints & DTOs**:
   - `POST /api/v1/uploads/selfie` → Multipart form | Res: `UploadDTO` (`upload_id`, `image_url`)
   - `POST /api/v1/skin/analyze` → Req: `AnalyzeSkinRequest` (`journey_id`, `selfie_upload_id`) | Res: `ProcessingDTO` (`job_id`)
   - `GET /api/v1/jobs/{job_id}` → Res: `JobStatusDTO` (`status: QUEUED|PROCESSING|COMPLETED|FAILED`)
   - `GET /api/v1/skin/{journey_id}` → Res: `SkinAnalysisDTO`
7. **Validation Rules**: File size < 10MB; Mime types: `image/jpeg`, `image/png`, `image/webp`. Dimensions ≥ 480x480px.
8. **Business Logic**: Asynchronous polling pattern for YouCam analysis. Raw YouCam API response stored in `raw_response` (JSONB) and normalized into 0–100 metrics.
9. **State Management**: `useJourneyStore` tracks `selfie_upload_id` and `skin_analysis` status.
10. **Local Storage**: Temporary preview object URL.
11. **AI Integration**: **YouCam Skin AI API**: Provider Adapter `YouCamSkinAdapter` (`apps/api/providers/youcam/skin_adapter.py`). Fallback to deterministic image quality scoring engine if keys are absent.
12. **Third-Party Services**: YouCam PerfectCorp Skin AI API.
13. **Security**: Sanitize file names; scan for malformed headers; sign S3 URLs with 15-minute expiration.
14. **Background Jobs**: Celery / BackgroundTask: `process_skin_analysis_job(job_id)`.
15. **Error Handling**: Image invalid → `422 Unprocessable Entity`. Provider timeout → retry 3 times before setting `FAILED` status and using fallback analysis.
16. **Notifications**: Progress bar updates on screen; toast on analysis completion.
17. **Analytics**: Log `selfie_uploaded`, `skin_analysis_completed`.
18. **Performance**: Image thumbnail generation on upload; asynchronous non-blocking API call.
19. **Accessibility**: Hidden native file input linked to visual dropzone button.

---

### Module 05: Outfit Upload & Style Compare VTO (Screens 26–29)

1. **Screen Purpose**: Upload multiple outfit options, perform AI Virtual Try-On (YouCam Apparel VTO), rank outfits by event appropriateness, and display side-by-side comparison.
2. **User Actions**:
   - Upload 1 to 5 outfit images.
   - Label outfit names (e.g., "Navy Suit", "Grey Blazer").
   - Click `Start Virtual Try-On`.
   - View VTO generated previews and AI outfit rankings.
3. **Backend Services**: `VirtualTryOnService` (Calls YouCam VTO API, generates try-on images, ranks suitability).
4. **Database Tables**:
   - `outfit_uploads` (`id`, `journey_id`, `storage_url`, `name`, `category`, `display_order`).
   - `outfit_comparisons` (`id`, `journey_id`, `outfit_id`, `vto_image_url`, `ranking`, `overall_score`, `event_match`, `professionalism`, `confidence`).
5. **Storage Requirements**: Object Storage Buckets `outfits` & `vto-results`.
6. **API Endpoints & DTOs**:
   - `POST /api/v1/uploads/outfits` → Multipart form | Res: `OutfitDTO[]`
   - `POST /api/v1/vto/generate` → Req: `VTORequest` (`journey_id`, `outfit_ids`) | Res: `JobDTO` (`job_id`)
   - `GET /api/v1/vto/results/{journey_id}` → Res: `ComparisonDTO`
7. **Validation Rules**: 1 to 5 outfits allowed per journey.
8. **Business Logic**: Outfits scored against `Event` context (e.g., formal suit gets +20 event match for interview vs. casual t-shirt).
9. **State Management**: React Query + Zustand stores list of uploaded outfits and comparison results.
10. **Local Storage**: Cache selected outfit IDs.
11. **AI Integration**: **YouCam Apparel VTO API**: Provider Adapter `YouCamVTOAdapter`.
12. **Third-Party Services**: YouCam Apparel VTO.
13. **Security**: Ensure `outfit_id` belongs to authenticated user's `journey_id`.
14. **Background Jobs**: Async worker `process_vto_generation_job(job_id)`.
15. **Error Handling**: VTO error → display outfit upload without VTO overlay, mark `confidence: 70%`.
16. **Notifications**: Progress indicator on VTO loading screen ("Adjusting fabric drape...").
17. **Analytics**: Log `outfits_uploaded`, `vto_generated`, `winning_outfit_selected`.
18. **Performance**: Parallel processing of multiple outfit try-on requests.
19. **Accessibility**: Side-by-side comparison supports tab navigation and aria-selected indicators.

---

### Module 06: Presence Intelligence Engine & Recommendations (Screens 30–36)

1. **Screen Purpose**: Execute PersonaIQ's proprietary **Persona Engine™**, compute the **Presence Index™ (0–100)**, generate explainable recommendations via Gemini, compile the final **Best Presence Plan™**, and present the interactive checklist.
2. **User Actions**:
   - Trigger `Generate Presence Plan`.
   - Inspect Presence Index breakdown (Appearance, Style, Context, Preparation, Professional Alignment).
   - View prioritized AI recommendations.
   - Check off items in the interactive Preparation Checklist.
   - Click `Complete Journey`.
3. **Backend Services**:
   - `PresenceService` (Executes 5-stage mathematical scoring algorithm per document `PIQ-AI-002`).
   - `RecommendationService` (Prompts Gemini LLM using `packages/prompts`, parses JSON response, builds explainability cards).
4. **Database Tables**:
   - `presence_plans` (`id`, `journey_id`, `presence_index`, `overall_confidence`, `recommended_outfit_id`, `summary`, `reasoning`, `version`).
   - `recommendations` (`id`, `presence_plan_id`, `priority`, `title`, `description`, `reason`, `impact`, `effort`, `confidence`, `category`, `status`).
   - `preparation_checklists` (`id`, `recommendation_id`, `label`, `completed`, `completed_at`).
5. **Storage Requirements**: PDF export storage bucket `exports/`.
6. **API Endpoints & DTOs**:
   - `POST /api/v1/presence/generate` → Req: `GeneratePresenceRequest` (`journey_id`) | Res: `JobDTO`
   - `GET /api/v1/presence/{journey_id}` → Res: `PresenceDTO`
   - `GET /api/v1/recommendations/{journey_id}` → Res: `RecommendationDTO[]`
   - `PATCH /api/v1/recommendations/{id}/checklist` → Req: `UpdateChecklistRequest` | Res: `ChecklistDTO`
   - `POST /api/v1/journeys/{id}/complete` → Res: `PresencePlanDTO`
7. **Validation Rules**: Cannot generate Presence Plan without completing selfie analysis and event setup.
8. **Business Logic**:
   - **Presence Index Formula**:
     $$\text{Score} = (A \times 0.30) + (S \times 0.25) + (C \times 0.20) + (P \times 0.15) + (PA \times 0.10)$$
     Adjusted by confidence coefficient and capped bonuses (+10) / penalties (-20).
   - Recommendations ordered by: High Impact + Low Effort = Highest Priority.
   - Completing journey updates `Journey.status = COMPLETED` and `Journey.completedAt = NOW()`.
9. **State Management**: Zustand `usePresenceStore` manages active checklist toggle states with optimistic UI updates.
10. **Local Storage**: Backup completed checklist IDs in localStorage.
11. **AI Integration**: **Gemini LLM API** (`gemini-1.5-pro` / `gemini-1.5-flash`): Prompt orchestrator in `packages/prompts`. Enforces JSON Schema output.
12. **Third-Party Services**: Google Gemini API.
13. **Security**: Server-side prompt construction; user inputs sanitized before injection into Gemini templates.
14. **Background Jobs**: Async worker `generate_presence_plan_job(job_id)`.
15. **Error Handling**: Gemini API error → fallback to deterministic rule-based recommendation generator (`RuleBasedRecommendationEngine`).
16. **Notifications**: Success modal on journey completion.
17. **Analytics**: Log `presence_plan_generated`, `checklist_item_completed`, `journey_completed`.
18. **Performance**: Immutable cached presence plans return in <15ms on repeat lookups.
19. **Accessibility**: Interactive checklist uses native checkboxes wrapped in accessible components.

---

### Module 07: Results, History & PresenceDNA (Screens 37–44, 63, 65)

1. **Screen Purpose**: View archived journeys, compare growth over time, inspect personal style DNA metrics, manage wardrobe library, and generate PDF exports.
2. **User Actions**:
   - Search and filter journey history.
   - Click `View Details` on past journey.
   - Click `Compare Journeys` to view side-by-side progression.
   - View `PresenceDNA™` style analytics.
   - Export report as PDF/PNG.
3. **Backend Services**:
   - `HistoryService` (Paginated search and filter over past journeys).
   - `ExportService` (Renders PDF report using Headless Chromium / WeasyPrint).
4. **Database Tables**: `journeys`, `presence_plans`, `exports` (`id`, `journey_id`, `format`, `storage_url`, `download_count`).
5. **Storage Requirements**: Generated PDF reports stored in `exports/{journey_id}.pdf`.
6. **API Endpoints & DTOs**:
   - `GET /api/v1/history` → Params: `page`, `limit`, `event_type`, `search` | Res: `PaginatedHistoryDTO`
   - `GET /api/v1/history/{journey_id}` → Res: `ArchivedJourneyDTO`
   - `GET /api/v1/presence-dna` → Res: `PresenceDNADTO`
   - `POST /api/v1/export/pdf` → Req: `ExportRequest` (`journey_id`) | Res: `ExportDTO` (`download_url`)
7. **Validation Rules**: User can only export their own completed journeys.
8. **Business Logic**: PresenceDNA computes aggregate statistics: favorite dress codes, average presence index trend, highest ranking colors.
9. **State Management**: React Query caching for history lists and pagination.
10. **Local Storage**: Search query history.
11. **AI Integration**: None (historical aggregations).
12. **Third-Party Services**: Headless PDF generator service.
13. **Security**: Signed URLs with short expiration (15 minutes) for PDF downloads.
14. **Background Jobs**: PDF generation background worker `generate_pdf_export_job`.
15. **Error Handling**: Export timeout → return retry link.
16. **Notifications**: Toast notification when PDF download is ready.
17. **Analytics**: Log `history_viewed`, `presence_dna_viewed`, `pdf_exported`.
18. **Performance**: DB Indexes on `journeys(user_id, status, created_at DESC)` guarantee history queries execute in <50ms.
19. **Accessibility**: Tables and history timelines include keyboard navigation and ARIA labels.

---

### Module 08: Profile & Settings (Screens 45–50)

1. **Screen Purpose**: Manage user account details, theme preferences, notification toggles, privacy settings (data retention, selfie deletion), and connected accounts.
2. **User Actions**: Update name, occupation, country, timezone; toggle theme; toggle privacy settings; click `Delete Account`.
3. **Backend Services**: `UserService` (Profile updates, account soft/hard deletion); `SettingsService` (Manages user preferences).
4. **Database Tables**: `users`, `user_preferences`.
5. **Storage Requirements**: Profile avatar updates.
6. **API Endpoints & DTOs**:
   - `GET /api/v1/profile` → Res: `ProfileDTO`
   - `PATCH /api/v1/profile` → Req: `UpdateProfileRequest` | Res: `ProfileDTO`
   - `GET /api/v1/settings` → Res: `SettingsDTO`
   - `PATCH /api/v1/settings` → Req: `UpdateSettingsRequest` | Res: `SettingsDTO`
   - `DELETE /api/v1/profile` → Soft/hard delete user data | Res: `SuccessDTO`
7. **Validation Rules**: Occupation max 100 chars; timezone must be valid IANA timezone string.
8. **Business Logic**: Account deletion soft-deletes `users` record, revokes JWT tokens, and queues background job to purge storage objects.
9. **State Management**: `useSettingsStore` for instant theme and accessibility updates.
10. **Local Storage**: `personaiq_theme` synced immediately on toggle.
11. **AI Integration**: None.
12. **Third-Party Services**: Identity Provider account management.
13. **Security**: Require current password / re-authentication before account deletion.
14. **Background Jobs**: Async storage purge worker `purge_user_data_job(user_id)`.
15. **Error Handling**: Re-auth failure on account deletion → `403 Forbidden`.
16. **Notifications**: Success toasts on settings update.
17. **Analytics**: Log `profile_updated`, `theme_changed`, `account_deleted`.
18. **Performance**: Quick direct key-value updates.
19. **Accessibility**: Toggle switches have accessible `role="switch"` and `aria-checked` attributes.

---

### Module 09: System States & Exceptions (Screens 51–60, 62, 64)

1. **Screen Purpose**: Provide resilient, defensive exception handling for 404, 500, offline mode, missing permissions, upload failures, and expired sessions.
2. **User Actions**: Click `Retry` on upload/API error; click `Grant Camera Permission`; click `Return to Dashboard`.
3. **Backend Services**: Centralized exception handlers in `apps/api/middleware/error_handler.py`.
4. **Database Tables**: `ai_request_logs` (`id`, `journey_id`, `provider`, `model`, `latency`, `status`, `token_usage`, `error_message`).
5. **Storage Requirements**: None.
6. **API Endpoints & DTOs**:
   - `GET /api/v1/health` → Res: `HealthDTO` (`status: "ok"`, `db: true`, `ai_providers: true`)
   - `GET /api/v1/status` → Res: `SystemStatusDTO`
7. **Validation Rules**: All uncaught exceptions return uniform error schema: `{ "success": false, "error": { "code": "...", "message": "..." } }`.
8. **Business Logic**: Log all 5xx errors to `ai_request_logs` or system logger; never leak raw Python stack traces.
9. **State Management**: Global `useErrorStore` captures network disconnects and API errors.
10. **Local Storage**: Store offline journey queue if network drops mid-wizard.
11. **AI Integration**: Fallback AI provider failover logic.
12. **Third-Party Services**: Sentry / OpenTelemetry logging.
13. **Security**: Zero stack trace disclosure; generic error messages for end users.
14. **Background Jobs**: Periodic health-check worker monitoring YouCam & Gemini endpoint availability.
15. **Error Handling**: Automatic retry with exponential backoff on transient network failures.
16. **Notifications**: Global error toast / persistent banner when offline.
17. **Analytics**: Log `error_encountered`, `retry_attempted`.
18. **Performance**: Health check endpoints respond in <5ms.
19. **Accessibility**: System exception pages retain full accessibility and skip-to-content links.

---

## 4. Implementation Priority Classification (P0 – P3)

```text
P0 — Critical (Application cannot function without it)
├── P0-01: Database Migration & Schema Generation (14 Models)
├── P0-02: FastAPI Core Project Architecture, Middleware & Error Handlers
├── P0-03: Supabase Auth JWT Verification Middleware
├── P0-04: User Profile & Onboarding APIs (`POST /auth/sign-in`, `GET /auth/me`, `PATCH /profile/onboarding`)
├── P0-05: Journey Lifecycle APIs (`POST /journeys`, `PATCH /journeys/{id}/event`, `GET /journeys/{id}`)
├── P0-06: Storage Service & File Upload APIs (`POST /uploads/selfie`, `POST /uploads/outfits`)
├── P0-07: Proprietary Presence Intelligence Scoring Engine (`packages/ai-core`)
└── P0-08: Executive Dashboard Aggregation API (`GET /dashboard`)

P1 — Required for MVP
├── P1-01: YouCam Skin AI Provider Adapter & Normalizer
├── P1-02: YouCam Apparel VTO Provider Adapter & Comparison Engine
├── P1-03: Gemini LLM Recommendation Engine & Explainability Pipeline
├── P1-04: Presence Plan Generation & Interactive Checklist APIs
├── P1-05: Journey Completion & History Archive APIs (`GET /history`, `GET /history/{id}`)
├── P1-06: System Health & Exception Monitoring (`GET /health`, `/status`)
└── P1-07: Frontend Service Integration (Replacing mock data with real API clients)

P2 — Post-MVP Polish
├── P2-01: PDF Export Generation Service (`POST /export/pdf`)
├── P2-02: PresenceDNA™ Analytics Aggregation Engine
├── P2-03: Advanced Security (Account Lockout Cooldown, 2FA Verification)
└── P2-04: User Settings & Privacy Auto-Purge Worker

P3 — Future Roadmap
├── P3-01: Calendar Integration (Google/Outlook Sync)
├── P3-02: Hair & Accessory Analysis AI Modules
└── P3-03: Voice Coaching & Real-Time Camera Mode
```

---

## 5. Sequential Implementation Checklist (001 – 035)

### Phase 1: Database & Core Infrastructure
- [ ] `001` Initialize database ORM schema and generate client.
- [ ] `002` Run initial PostgreSQL database migration (`init_schema`).
- [ ] `003` Configure `apps/api` FastAPI app structure, CORS policy, and environment configuration in `core/config.py`.
- [ ] `004` Build central exception handler in `apps/api/middleware/error_handler.py` to enforce standardized JSON responses.
- [ ] `005` Implement Supabase Auth JWT verification middleware in `apps/api/middleware/auth.py`.
- [ ] `006` Build health check router `apps/api/routers/health.py` (`GET /health`, `GET /status`).

### Phase 2: User & Authentication Endpoints
- [ ] `007` Implement `UserRepository` and `UserService` for profile management.
- [ ] `008` Build `GET /api/v1/auth/me` endpoint.
- [ ] `009` Build `PATCH /api/v1/profile/onboarding` endpoint to complete user onboarding.
- [ ] `010` Build `GET /api/v1/profile` and `PATCH /api/v1/profile` endpoints.

### Phase 3: Journey Management & Event Setup
- [ ] `011` Implement `JourneyRepository` and `JourneyService`.
- [ ] `012` Build `POST /api/v1/journeys` (create draft journey).
- [ ] `013` Build `PATCH /api/v1/journeys/{id}/event` (update event context, dress code, industry).
- [ ] `014` Build `GET /api/v1/journeys/{id}` (fetch complete journey context).

### Phase 4: Storage & Image Uploads
- [ ] `015` Implement `StorageService` for Supabase Storage integration (`selfies` & `outfits` buckets).
- [ ] `016` Build `POST /api/v1/uploads/selfie` endpoint (multipart upload & `SelfieUpload` database record).
- [ ] `017` Build `POST /api/v1/uploads/outfits` endpoint (multi-file upload & `OutfitUpload` records).

### Phase 5: AI Engine & Provider Adapters
- [ ] `018` Create `YouCamSkinAdapter` in `apps/api/providers/youcam/skin_adapter.py` with score normalization.
- [ ] `019` Build `POST /api/v1/skin/analyze` and `GET /api/v1/skin/{journeyId}` endpoints.
- [ ] `020` Create `YouCamVTOAdapter` in `apps/api/providers/youcam/vto_adapter.py`.
- [ ] `021` Build `POST /api/v1/vto/generate` and `GET /api/v1/vto/results/{journeyId}` endpoints.
- [ ] `022` Build proprietary `PresenceEngine` scoring module in `packages/ai-core` (calculates 0–100 score per spec PIQ-AI-002).
- [ ] `023` Create `GeminiAdapter` in `apps/api/providers/gemini/adapter.py` using prompt templates from `packages/prompts`.
- [ ] `024` Build `POST /api/v1/presence/generate` and `GET /api/v1/presence/{journeyId}` endpoints.
- [ ] `025` Build `GET /api/v1/recommendations/{journeyId}` and `PATCH /api/v1/recommendations/{id}/checklist` endpoints.
- [ ] `026` Build `POST /api/v1/journeys/{id}/complete` endpoint (saves immutable `PresencePlan`).

### Phase 6: Executive Dashboard & History
- [ ] `027` Implement `DashboardService` aggregating user metrics.
- [ ] `028` Build `GET /api/v1/dashboard` endpoint returning `DashboardDTO`.
- [ ] `029` Implement `HistoryService` with search, filter, and pagination.
- [ ] `030` Build `GET /api/v1/history` and `GET /api/v1/history/{journeyId}` endpoints.
- [ ] `031` Build `GET /api/v1/presence-dna` endpoint.

### Phase 7: Frontend Service Wiring & Verification
- [ ] `032` Create frontend API client services in `apps/web/lib/api/` (`apiClient`, `authApi`, `journeyApi`, `presenceApi`).
- [ ] `033` Wire Next.js frontend screens (Dashboard, Journey Wizard, Results, History) to real API client calls.
- [ ] `034` Verify full end-to-end journey execution without mock data.
- [ ] `035` Execute production build validation (`npm run build`) and update documentation.
