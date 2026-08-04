# PersonaIQ Engineering Blueprint Overview

*Note: This document serves as a high-level checklist and architectural target to verify the full engineering documentation package later.*

## Expected Engineering Package (15 Documents)
`docs/06-engineering/`
1. `01-system-architecture.md`
2. `02-ai-architecture.md`
3. `03-frontend-architecture.md`
4. `04-backend-architecture.md`
5. `05-database-design.md`
6. `06-api-specification.md`
7. `07-ai-agent-architecture.md`
8. `08-security.md`
9. `09-deployment.md`
10. `10-development-roadmap.md`
11. `11-folder-structure.md`
12. `12-state-management.md`
13. `13-component-architecture.md`
14. `14-design-system-implementation.md`
15. `15-testing-strategy.md`

## Core Architectural Decisions to Verify Against
- **System Stack:** Next.js (Frontend), FastAPI (Backend), PostgreSQL & Prisma (DB), Redis, Supabase, YouCam MCP, Gemini.
- **AI Workflow:** User -> Context Engine -> Persona Engine -> Skin Analysis -> Outfit Analyzer -> Presence Score Engine -> Recommendation Engine -> LLM Explanation Engine -> Best Presence Plan.
- **Backend Pattern:** "One Page -> One API -> One DTO". Strict flow: Controllers -> Services -> Repositories -> Database -> External APIs.
- **Frontend Pattern:** App Router -> Layouts -> Pages -> Components -> Hooks -> Stores -> Services -> API Client.
- **Database Entities:** Users, Journeys, JourneySteps, Events, Outfits, Uploads, SkinAnalysis, VTOJobs, Recommendations, PresencePlans, PresenceScores, Checklists, Exports.
- **State Management:** TanStack Query + Zustand + React Hook Form + Server Actions.
