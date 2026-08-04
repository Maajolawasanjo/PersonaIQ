# PersonaIQ
# State Management Architecture

**Document ID:** PIQ-ENG-008  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Frontend Engineering  

---

# Purpose
This document defines how application state is managed throughout PersonaIQ.
The objective is to create a predictable, scalable, and performant state architecture that minimizes unnecessary re-renders, eliminates duplicated state, and provides a consistent developer experience.

PersonaIQ follows the philosophy:
> Single Source of Truth ↓ Minimal Client State ↓ Server-First Architecture ↓ Predictable Data Flow

---

# State Management Philosophy
PersonaIQ separates state into distinct categories. Every piece of state belongs to exactly one category. Never duplicate state across multiple stores.

---

# State Categories

## 1. Server State
**Managed by:** TanStack Query
**Examples:** User profile, Dashboard, Journeys, Skin Analysis, Presence Plan, Recommendations, History, Settings.
**Rules:** Never duplicate in Zustand. Cached automatically. Background revalidation. Optimistic mutations where appropriate.

## 2. Client State
**Managed by:** Zustand
**Examples:** Current wizard step, Sidebar state, Selected outfit, Active theme, Upload progress, Modal visibility, Temporary image previews.
**Rules:** Never store API responses. Never persist business data. UI-only state.

## 3. Form State
**Managed by:** React Hook Form
**Validation:** Zod
**Examples:** Journey creation, Profile editing, Settings, Event details, Preferences.
**Rules:** Forms own their own state. Validation before submission. Reset after successful mutation.

## 4. URL State
**Managed by:** Next.js App Router
**Examples:** Journey ID, History filters, Search queries, Pagination, Sort order.
**Rules:** URL represents shareable application state. Never duplicate in Zustand.

## 5. Session State
**Managed by:** Clerk
**Examples:** Authentication, User identity, JWT, Session expiration.
*PersonaIQ never manually manages authentication state.*

---

# Data Ownership
Server ↓ TanStack Query ↓ Feature Hook ↓ Component.
*Only one source owns each dataset.*

---

# Global Stores

## UI Store
**Purpose:** Application interface state
**Contains:** Sidebar open, Command palette, Theme, Mobile menu, Notifications drawer.

## Journey Store
**Purpose:** Temporary journey progress
**Contains:** Current step, Uploaded image previews, Selected outfit, Wizard completion percentage.
*Does NOT contain: Skin analysis, Presence score, Recommendations. (Those belong to the server).*

## Upload Store
**Purpose:** Track uploads
**Contains:** Upload queue, Progress, Retry status, Compression status.
*Destroyed after completion.*

---

# TanStack Query Architecture

**Query Keys:**
```json
["dashboard"]
["journeys"]
["journey", "id"]
["skin", "journeyId"]
["presence", "journeyId"]
["recommendations", "journeyId"]
["history"]
["profile"]
["settings"]
```
Mutations invalidate only affected queries.

---

# Query Lifecycle
User Action ↓ Mutation ↓ API Request ↓ Success ↓ Invalidate Query ↓ Background Refetch ↓ UI Update

---

# Cache Strategy
- **Dashboard:** 5 minutes
- **Profile:** 30 minutes
- **Settings:** 1 hour
- **History:** 10 minutes
- **Journey:** 5 minutes
- **Presence Plan:** Until invalidated
- **Recommendations:** Until invalidated

---

# Optimistic Updates
**Used for:** Checklist completion, Journey title editing, Profile updates, Settings changes.
**Not used for:** AI analysis, Presence calculations, Skin results, Virtual Try-On. *(These always require server confirmation).*

---

# Upload Flow
Image Selected ↓ Compression ↓ Preview ↓ Upload ↓ Progress ↓ Processing ↓ Complete ↓ Cache Refresh.
*The upload state never persists after completion.*

---

# AI Processing Flow
User Starts Analysis ↓ `POST /analyze` ↓ Job Created ↓ Polling ↓ Completed ↓ Cache Update ↓ UI Refresh.
*No AI processing state is stored globally after completion.*

---

# Error State
Errors belong to the feature that generated them.
- Journey Error ↓ Journey Components
- Upload Error ↓ Upload Components
*Never use one global error store.*

---

# Loading State
Loading follows the same ownership principle.
- Dashboard Loading ↓ Dashboard
- Journey Loading ↓ Journey
- Presence Loading ↓ Presence
*Skeletons preferred over global spinners.*

---

# State Persistence
**Persist only:** Theme, Sidebar preference, Draft journey (optional), Recently used settings.
**Never persist:** JWT, AI responses, Presence Plans, Recommendations, Upload progress.

---

# Component Communication
**Preferred:** Props ↓ Feature Hooks ↓ Query.
Avoid deep prop drilling. Avoid unnecessary Context Providers.

---

# Context Providers
`ThemeProvider`, `QueryProvider`, `AuthProvider`, `ToastProvider`, `JourneyProvider`.
*No additional global providers without architectural review.*

---

# Derived State
Always derive instead of duplicating.
**Incorrect:** Store (Presence Percentage), Store (Completed Recommendations)
**Correct:** Calculate from `RecommendationDTO`.

---

# Offline Strategy
*Future Support:* Cached Dashboard, Cached History, Retry Queue, Offline Upload Queue, Read-only Journey History.
*Not required for MVP.*

---

# Performance Rules
- Never fetch inside deeply nested components.
- Use feature hooks.
- Memoize expensive calculations.
- Keep Zustand stores small.
- Avoid unnecessary Context usage.
- Prefer Server Components whenever possible.

---

# Debugging
**Development tools:** TanStack Query Devtools, React DevTools, Zustand Devtools, Request Logger, Performance Profiler.

---

# Architectural Rules
✓ One owner per state  
✓ Server state stays on server  
✓ UI state stays local  
✓ Forms own their data  
✓ URL owns navigation state  
✓ Authentication owned by Clerk  
✓ No duplicated state  
✓ Predictable cache invalidation  
✓ Feature-based stores  
✓ Enterprise scalability  

---

# Future Expansion
Supports: AI streaming, Real-time collaboration, WebSockets, Offline mode, Mobile synchronization, Multi-device sessions.
*No redesign required.*

---

# Definition of Done
✓ Clear ownership model  
✓ Server-first state management  
✓ Predictable data flow  
✓ Optimized caching  
✓ Minimal client state  
✓ Scalable architecture  
✓ Ready for production  
✓ Ready for Antigravity implementation
