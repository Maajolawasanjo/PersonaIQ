# PersonaIQ
# Folder Structure

**Document ID:** PIQ-ENG-007  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Engineering Team  
**Repository:** Monorepo  

---

# Purpose
This document defines the official repository structure for PersonaIQ.
The repository is designed for:
- Scalability
- Clear separation of concerns
- Shared packages
- Independent deployment
- AI-first architecture
- Future mobile expansion
- Enterprise maintainability

The structure follows a **feature-first + package-first** philosophy.

---

# Repository Overview
```text
persona-iq/
├── apps/
├── packages/
├── docs/
├── tooling/
├── scripts/
├── docker/
├── infra/
├── .github/
├── .husky/
├── .vscode/
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── README.md
└── LICENSE
```

---

# Root Directory

## apps/
Contains deployable applications.
```text
apps/
├── web/
└── api/
```
*(Future: mobile/, desktop/, admin/, marketing/)*

---

# apps/web
Next.js 15 Application

```text
web/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── providers/
├── styles/
├── public/
├── types/
├── utils/
├── middleware.ts
└── next.config.ts
```

## app/
Uses App Router.
```text
app/
├── (marketing)/
├── (auth)/
├── (dashboard)/
├── api/
├── layout.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

## components/
Reusable UI. No business logic.
```text
components/
├── ui/
├── layout/
├── cards/
├── navigation/
├── forms/
├── charts/
├── feedback/
├── modals/
├── icons/
└── animations/
```

## features/
Business domains.
```text
features/
├── authentication/
├── dashboard/
├── journeys/
├── presence/
├── skin-analysis/
├── virtual-try-on/
├── recommendations/
├── history/
├── exports/
├── settings/
└── analytics/
```
Each feature owns: `components/`, `hooks/`, `services/`, `validators/`, `types/`, `constants/`, `utils/`.

## hooks/
Global reusable hooks.
```text
hooks/
├── use-mobile.ts
├── use-theme.ts
├── use-upload.ts
├── use-local-storage.ts
├── use-debounce.ts
└── use-media-query.ts
```

## lib/
Shared libraries.
```text
lib/
├── api/
├── auth/
├── storage/
├── theme/
├── utils/
├── constants/
├── config/
├── logger/
└── tracking/
```

## providers/
React providers: `ThemeProvider`, `QueryProvider`, `AuthProvider`, `ToastProvider`, `JourneyProvider`.

## styles/
`globals.css`, `animations.css`, `tokens.css`, `typography.css`.

---

# apps/api
FastAPI Backend

```text
api/
├── app/
├── core/
├── services/
├── repositories/
├── dto/
├── models/
├── schemas/
├── routers/
├── middleware/
├── providers/
├── workers/
├── events/
├── utils/
├── tests/
└── main.py
```

## app/
Application entry: `api/`, `startup.py`, `shutdown.py`, `dependencies.py`.

## core/
Infrastructure: `config.py`, `database.py`, `security.py`, `cache.py`, `logging.py`, `settings.py`.

## routers/
HTTP controllers (remain thin).
`auth.py`, `dashboard.py`, `journeys.py`, `uploads.py`, `skin.py`, `vto.py`, `presence.py`, `history.py`, `exports.py`, `settings.py`.

## services/
Business logic (No HTTP code).
`authentication.service.py`, `journey.service.py`, `presence.service.py`, `recommendation.service.py`, `skin.service.py`, `vto.service.py`, `analytics.service.py`, `export.service.py`.

## repositories/
Database access (Only persistence).
`user.repository.py`, `journey.repository.py`, `presence.repository.py`, `recommendation.repository.py`.

## dto/
Response contracts.
`dashboard.dto.py`, `journey.dto.py`, `presence.dto.py`, `recommendation.dto.py`, `history.dto.py`.

## schemas/
Request validation (Pydantic models only).
`journey.py`, `upload.py`, `presence.py`, `settings.py`.

## providers/
External integrations.
- **youcam/**: `adapter.py`, `client.py`, `mapper.py`, `types.py`, `exceptions.py`
- **gemini/**: `adapter.py`, `client.py`, `prompt-builder.py`, `parser.py`
- **storage/**
- **email/**

## workers/
Background jobs.
`skin-analysis.py`, `vto.py`, `presence.py`, `exports.py`, `cleanup.py`.

## events/
Future event-driven architecture.
`journey.events.py`, `presence.events.py`, `upload.events.py`.

---

# packages/
Shared code.

## packages/ui
Shared Design System. Every app consumes this package.
`components/`, `tokens/`, `icons/`, `animations/`, `themes/`.

## packages/prompts
Central AI prompts. Version-controlled.
`journey/`, `presence/`, `recommendations/`, `exports/`, `system/`.

## packages/sdk
PersonaIQ SDK (Future Public developer SDK).
`client/`, `types/`, `utils/`, `hooks/`.

## packages/types
Shared TypeScript types.
`journey.ts`, `presence.ts`, `recommendation.ts`, `user.ts`.

## packages/config
Shared configuration.
`env/`, `constants/`, `routes/`, `theme/`.

## packages/ai-core (Architectural Enhancement)
Encapsulates the AI reasoning into a reusable engine, separating business logic from AI logic.
```text
packages/ai-core/
├── persona-engine/
├── presence-engine/
├── confidence-engine/
├── explainability-engine/
├── prompt-engine/
├── scoring/
├── workflows/
├── adapters/
├── schemas/
└── index.ts
```

---

# Additional Infrastructure

- **docs/**: Entire project documentation (`00-product/`, `01-brand/`, `05-architecture/`, `06-engineering/`, etc.)
- **scripts/**: Development utilities (`seed.ts`, `generate-icons.ts`, etc.)
- **tooling/**: Development configuration (`eslint/`, `prettier/`, `commitlint/`)
- **infra/**: Infrastructure as Code (`docker/`, `terraform/`, `vercel/`, `railway/`)
- **docker/**: Containerization (`Dockerfile.web`, `Dockerfile.api`, `docker-compose.yml`)
- **.github/**: Automation (`workflows/`, `ISSUE_TEMPLATE/`)
- **public/**: Static assets (`images/`, `fonts/`, `icons/`)
- **tests/**: `unit/`, `integration/`, `e2e/`, `performance/`

---

# Naming Conventions
- **Folders:** kebab-case
- **Files:** kebab-case
- **Components:** PascalCase
- **Hooks:** camelCase
- **Services:** `*.service.ts` / `*.service.py`
- **Repositories:** `*.repository.ts` / `*.repository.py`
- **DTOs:** `*.dto.ts` / `*.dto.py`
- **Schemas:** `*.schema.ts` / `*.schema.py`
- **Providers:** `*.provider.ts` / `*.provider.py`

---

# Architectural Rules
✓ Feature-first organization  
✓ Shared packages  
✓ No circular dependencies  
✓ Domain isolation  
✓ Thin controllers  
✓ Service-oriented backend  
✓ Shared design system  
✓ Version-controlled AI prompts  
✓ External providers isolated  
✓ Monorepo ready  

---

# Future Expansion
This repository supports: Native iOS app, Native Android app, Desktop application, Browser extension, Enterprise Admin Portal, Team Workspaces, Public SDK, AI Marketplace, White-label deployments.
*No structural redesign should be required.*

---

# Definition of Done
✓ Turborepo-ready monorepo  
✓ Feature-first architecture  
✓ Shared packages  
✓ Independent deployable apps  
✓ AI prompt package  
✓ Design system package  
✓ Dedicated AI Core package  
✓ Enterprise scalability  
✓ Clean separation of concerns  
✓ Ready for Antigravity code generation  
✓ Ready for long-term product evolution
