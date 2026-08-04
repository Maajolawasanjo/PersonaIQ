# PersonaIQ
# Frontend Architecture

**Document ID:** PIQ-ENG-004  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Frontend Engineering  

---

# Purpose
This document defines the frontend architecture for PersonaIQ.
The frontend is responsible for:
- Delivering a premium user experience
- Managing application state
- Rendering AI-driven interfaces
- Communicating with backend services
- Maintaining accessibility and responsiveness
- Implementing the PersonaIQ Design System

The frontend must be scalable, maintainable, and optimized for performance while remaining visually consistent across every screen.

---

# Architectural Philosophy
PersonaIQ follows an **App Router + Server Components First** architecture.
Core principles:
- Server-first rendering
- Progressive enhancement
- Minimal client-side JavaScript
- Feature-based organization
- Shared design system
- Reusable UI primitives
- Predictable state management

---

# Technology Stack
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui
- **Icons:** Lucide React
- **Animation:** Motion (Framer Motion)
- **Forms:** React Hook Form
- **Validation:** Zod
- **Data Fetching:** TanStack Query
- **Client State:** Zustand
- **Tables:** TanStack Table
- **Charts:** Recharts
- **Theme:** next-themes
- **Image Optimization:** Next Image
- **Fonts:** Geist

---

# Rendering Strategy
PersonaIQ uses Server Components by default.

**Server Components:** Landing pages, Marketing pages, Dashboard layouts, Static content, Metadata, SEO.
**Client Components:** Forms, Upload widgets, AI processing, Interactive charts, Animated components, Drag-and-drop, Camera integration.

**Rule:** Everything is a Server Component unless interaction requires a Client Component.

---

# Route Structure
```text
app/
├── (marketing)
│   ├── page.tsx
│   ├── about
│   ├── pricing
│   ├── resources
│   └── contact
│
├── (auth)
│   ├── sign-in
│   ├── sign-up
│   └── onboarding
│
├── (dashboard)
│   ├── dashboard
│   ├── journeys
│   ├── history
│   ├── presence-dna
│   ├── settings
│   └── profile
│
├── api
│
├── layout.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

---

# Feature-Based Architecture
```text
src/
features/
authentication/
dashboard/
journeys/
presence/
recommendations/
history/
settings/
exports/
analytics/
```
Each feature owns: `components/`, `hooks/`, `services/`, `types/`, `validators/`, `utils/`, `constants/`.
This prevents unrelated code from becoming tightly coupled.

---

# Shared Directory
```text
src/
components/
ui/
layout/
navigation/
cards/
forms/
feedback/
charts/
modals/
providers/
```
Every component inside `/ui` must remain domain-independent.

---

# Layout Hierarchy
Root Layout ↓ Marketing Layout ↓ Dashboard Layout ↓ Journey Layout ↓ Screen Layout ↓ Page Content.
*Shared elements:* Navigation, Footer, Theme, Providers, Toast, Progress Bar.

---

# Component Architecture
Component hierarchy: Primitive ↓ Base Component ↓ Composite Component ↓ Feature Component ↓ Page Component.
*Example:* Button ↓ IconButton ↓ UploadButton ↓ JourneyUploadSection ↓ Upload Screen.

---

# Design System Rules
Every component must consume design tokens. Never use raw values.
- **Incorrect:** `padding: 24px` | **Correct:** `spacing-6`
- **Incorrect:** `#A31F34` | **Correct:** `color-primary`
- **Typography:** `font-heading`, `font-body`, `font-label`, `font-caption`
- **Radius:** `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`
- **Spacing:** `spacing-2`, `spacing-4`, `spacing-6`, `spacing-8`
- **Animation:** `duration-fast`, `duration-normal`, `duration-slow`

---

# State Management
PersonaIQ separates state into three categories.
1. **Server State (TanStack Query):** Journey, History, Dashboard, Recommendations, Presence Plan.
2. **Client State (Zustand):** Current journey, Wizard progress, Sidebar, Theme, Selected outfit, Temporary uploads.
3. **Form State (React Hook Form)**

---

# Data Flow
User ↓ React Component ↓ Feature Hook ↓ API Client ↓ Backend ↓ DTO ↓ TanStack Query Cache ↓ Component Update

---

# API Layer
All API communication passes through:
`src/lib/api/`: `api-client.ts`, `journeys.ts`, `presence.ts`, `uploads.ts`, `recommendations.ts`, `history.ts`, `users.ts`
*Never call `fetch()` directly inside components.*

---

# Form Architecture
Every form follows:
UI ↓ React Hook Form ↓ Zod Validation ↓ API Mutation ↓ Toast Feedback ↓ Optimistic Update ↓ Cache Refresh

---

# Upload Architecture
Selfie Upload ↓ Image Validation ↓ Compression ↓ Preview ↓ Upload ↓ AI Processing ↓ Progress Updates ↓ Result.
*The upload component is reusable for:* Selfies, Outfits, Documents, Future media.

---

# Journey Wizard
Each journey step is isolated.
*Example:* JourneyStepProvider ↓ Context ↓ Step Component ↓ Validation ↓ Auto Save ↓ Next Step.
No screen manages the entire wizard alone.

---

# Error Boundaries
Application ↓ Dashboard ↓ Journey ↓ Upload ↓ AI Results.
Failures should never crash the entire application.

---

# Loading Strategy
Use Suspense extensively. Loading states include: Skeletons, Progress indicators, AI processing timelines, Placeholder cards.
*Avoid generic loading spinners whenever context can be provided.*

---

# Animation Principles
Animations should communicate state.
- **Allowed:** Fade, Scale, Slide, Crossfade, Progress, Count-up.
- **Avoid:** Bounce, Excessive spring effects, Flash animations, Long delays.
- **Duration:** 150–350 ms (AI processing screens may extend beyond this).

---

# Theme Architecture
Supports: Light, Dark, System.
**Theme tokens:** Primary, Secondary, Accent, Surface, Border, Muted, Success, Warning, Error.
*No component should hardcode colors.*

---

# Typography
**Primary Font:** Geist
**Weights:** 300, 400, 500, 600, 700, 800
**Usage:** Headings (Geist SemiBold), Body (Geist Regular), Captions (Geist Medium), Code (Geist Mono).

---

# Accessibility
Minimum AA compliance. Keyboard navigation, Visible focus states, Screen reader labels, Semantic HTML, Proper heading hierarchy, Reduced motion support, Color contrast validation.

---

# Performance Goals
Initial Load <2 seconds | Dashboard <500 ms | Route Transition <150 ms | Image Preview Instant.
*Lazy Loading:* Every non-critical image. *Bundle Size:* Keep JavaScript minimal.

---

# SEO Strategy
Server-rendered marketing pages, Metadata API, Open Graph images, Twitter Cards, Structured Data, Canonical URLs, Sitemap, Robots.
*Dashboard pages remain private.*

---

# Future Expansion
Architecture should support: Native mobile apps, Desktop application, Offline mode, AI streaming, Voice interfaces, Live collaboration, Multi-language, White-label deployments, Design system packages.

---

# Definition of Done
✓ App Router architecture  
✓ Server Components by default  
✓ Feature-based organization  
✓ Shared Design System  
✓ Reusable UI primitives  
✓ Predictable state management  
✓ Accessible components  
✓ High-performance rendering  
✓ Enterprise scalability  
✓ Ready for production
