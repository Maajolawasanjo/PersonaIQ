# PersonaIQ
# API Specification

**Document ID:** PIQ-ENG-006  
**Version:** 1.0  
**Status:** Production Specification  
**Owner:** Backend Engineering  
**API Version:** v1  
**Protocol:** HTTPS REST API  
**Data Format:** JSON  
**Authentication:** Bearer JWT (Clerk)  

---

# Purpose
This document defines every public API endpoint exposed by PersonaIQ.
PersonaIQ follows a strict API philosophy:
> One Screen ↓ One Endpoint ↓ One DTO

Every primary UI screen communicates with one primary backend endpoint whenever practical.
This minimizes frontend orchestration while producing highly predictable APIs.

---

# API Standards
**Base URL:** `/api/v1`

**Response Format:**
Every endpoint returns:
```json
{
  "success": true,
  "data": {}
}
```

**Errors:**
```json
{
  "success": false,
  "error": {
      "code": "",
      "message": ""
  }
}
```

---

# Authentication
All endpoints require authentication except:
- `POST /auth/sign-in`
- `POST /auth/sign-up`
- `POST /auth/webhook`
- `GET /`
- `GET /health`
- `GET /landing`

**Authorization Header:**
`Authorization: Bearer <token>`

---

# MODULES
1. Authentication
2. Dashboard
3. Journey
4. Uploads
5. Skin Intelligence
6. Virtual Try-On
7. Presence Engine
8. Recommendations
9. History
10. Exports
11. Settings
12. Analytics

---

# AUTHENTICATION
- `POST /auth/sign-up`: Create account.
- `POST /auth/sign-in`: Authenticate user.
- `GET /auth/me`: Returns `UserDTO`.
- `POST /auth/logout`: Logout user.

---

# DASHBOARD
- `GET /dashboard`: Returns `DashboardDTO` (Contains Current Journey, Presence Score, Recent Journeys, Insights, Quick Actions, Notifications, Upcoming Event).

---

# JOURNEYS
- `POST /journeys`: Create Journey (Requires: `eventType`, `title`, `date`, `industry`). Returns `JourneyDTO`.
- `GET /journeys`: Returns Journey List.
- `GET /journeys/{id}`: Returns Complete `JourneyDTO`.
- `PATCH /journeys/{id}`: Update journey.
- `DELETE /journeys/{id}`: Archive journey.
- `POST /journeys/{id}/complete`: Marks journey complete. Returns `PresencePlanDTO`.

---

# EVENT
- `PATCH /journeys/{id}/event`: Updates Date, Time, Location, Dress Code, Importance, Industry.

---

# SELFIE UPLOAD
- `POST /uploads/selfie`: Multipart upload. Returns `UploadDTO` (`uploadId`, `imageUrl`, `status`).
- `GET /uploads/selfie/{id}`: Returns metadata.
- `DELETE /uploads/selfie/{id}`: Delete upload.

---

# OUTFIT UPLOAD
- `POST /uploads/outfits`: Multipart upload multiple outfits. Returns `OutfitDTO[]`.
- `PATCH /uploads/outfits/{id}`: Rename, Reorder, Category.
- `DELETE /uploads/outfits/{id}`: Delete outfit.
- `GET /uploads/outfits/{journeyId}`: Returns `OutfitDTO[]`.

---

# SKIN AI (Asynchronous Pattern)
- `POST /skin/analyze`: Start YouCam analysis. Returns `ProcessingDTO` (jobId).
- `GET /jobs/{jobId}`: Returns Status (QUEUED | PROCESSING | COMPLETED | FAILED).
- `GET /skin/{journeyId}`: Returns `SkinAnalysisDTO` (Hydration, Texture, Oil, Redness, Fatigue, Brightness, Recommendations, Confidence).

---

# VIRTUAL TRY-ON (Asynchronous Pattern)
- `POST /vto/generate`: Input: Journey, Selected outfits. Returns `JobDTO`.
- `GET /vto/{jobId}`: Returns Status.
- `GET /vto/results/{journeyId}`: Returns `ComparisonDTO` (Generated Images, Rankings, Confidence, Scores).

---

# PRESENCE ENGINE (Asynchronous Pattern)
- `POST /presence/generate`: Generate Presence Plan™. Returns `JobDTO`.
- `GET /presence/{journeyId}`: Returns `PresenceDTO` (Presence Index™, Confidence, Summary, Professional Match, Preparation).

---

# RECOMMENDATIONS
- `GET /recommendations/{journeyId}`: Returns `RecommendationDTO[]`.
- `PATCH /recommendations/{id}`: Mark completed, Skip, Undo.
- `GET /checklist/{journeyId}`: Returns `ChecklistDTO`.

---

# HISTORY
- `GET /history`: Returns paginated history.
- `GET /history/{journeyId}`: Returns Archived `JourneyDTO`.
- `POST /history/{journeyId}/duplicate`: Creates new journey.

---

# EXPORTS (Asynchronous Pattern)
- `POST /export/pdf`: Generate report. Returns `JobDTO`.
- `POST /export/image`: Generate PNG. Returns `JobDTO`.
- `GET /export/{id}`: Download.
- `GET /exports`: History.

---

# PROFILE
- `GET /profile`: Returns `ProfileDTO`.
- `PATCH /profile`: Update profile.

---

# SETTINGS
- `GET /settings`: Returns `SettingsDTO`.
- `PATCH /settings`: Update preferences (Theme, Notifications, Privacy, Language).

---

# ANALYTICS & SYSTEM
- `GET /analytics`: Returns Dashboard analytics (Admin only).
- `GET /health`: Returns Application health.
- `GET /version`: Returns API version.
- `GET /status`: Returns Dependencies (Database, YouCam, Gemini, Storage).

---

# STANDARD DTOs
DashboardDTO, JourneyDTO, PresenceDTO, PresencePlanDTO, RecommendationDTO, SkinAnalysisDTO, OutfitDTO, ComparisonDTO, ChecklistDTO, HistoryDTO, ProfileDTO, SettingsDTO, AnalyticsDTO, ExportDTO, UploadDTO, UserDTO, NotificationDTO, ErrorDTO.

---

# HTTP STATUS CODES
- **200:** OK
- **201:** Created
- **202:** Processing
- **204:** Deleted
- **400:** Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **409:** Conflict
- **422:** Invalid Input
- **429:** Rate Limited
- **500:** Server Error
- **503:** AI Provider Unavailable

---

# Rate Limits
- **Authenticated:** 100 requests/minute
- **AI Endpoints:** 20 requests/hour
- **Upload:** 50 images/day
- **Export:** 20/day
- **Admin:** Unlimited

---

# API Design Principles
✓ RESTful resources  
✓ Stateless  
✓ DTO-first  
✓ Predictable naming  
✓ Thin controllers  
✓ Consistent response format  
✓ Versioned endpoints  
✓ AI provider abstraction  
✓ Enterprise scalability  
✓ Asynchronous long-running AI operations  

---

# Future API Modules
`/v2`, `/calendar`, `/wardrobe`, `/hair`, `/accessories`, `/live-camera`, `/interview`, `/coaching`, `/organizations`, `/teams`
*These modules should be additive and should not require breaking changes to existing v1 endpoints.*

---

# Definition of Done
✓ Complete REST resource map  
✓ One Screen → One Endpoint → One DTO  
✓ Consistent response envelopes  
✓ Authentication and authorization model defined  
✓ Upload, AI, journey, export, and history APIs specified  
✓ Versioned API ready for implementation  
✓ Production-ready endpoint taxonomy  
✓ Implemented Asynchronous Polling pattern for AI operations
