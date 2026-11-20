# PERSONAIQ Reconstruction: Phase 0–1 Baseline

Started: 2026-11-20

## Baseline
- Repository: Maajolawasanjo/PersonaIQ
- Base commit: 7ce94734ab895d1f9cdacf651903491e00457119
- Working branch: audit/phase-0-1-trust-and-flow-fixes
- Vercel project: personaiq-web
- Production release: NOT performed

## Implemented in working branch
- CI uses pnpm and Node.js 24; verification no longer masks dependency vulnerabilities.
- Frontend TypeScript/lint build suppressions disabled.
- API CORS wildcard removed; camera allowed for same-origin use.
- VTO unavailability no longer returns an unchanged source image as successful generation.
- Journey creation, event details, and dress code now stop on backend persistence failure.
- Event selection now routes through event details; two invalid journey paths corrected.
- Journey listing uses the server's actual query parameters and unwrapped response contract.
- Dashboard redesigned around user actions and real overview data, without dummy analytics, events, or notifications.
- Progress presents actual counts and suppresses unsupported metrics.
- History reads backend journeys only; archive persists using the API and unsupported delete/demo controls are not shown.
- Privacy view removes non-persistent controls and directs users to support while data features are rebuilt.
- Capture flow privacy text no longer promises nonexistent retention guarantees.

## Open release blockers
- GitHub CI findings from this branch require resolution before merge.
- Authentication tokens remain available to JavaScript; adopt HttpOnly session design.
- Storage access controls, deletion and retention workflows require verification.
- Image analysis still includes unvalidated face/skin inference and fake fallback scores.
- End-to-end journey result and report persistence are not yet reconciled.
- Wardrobe favorites and VTO saved looks remain partly local; fix persistence.
- User settings, billing, marketing claims, accessibility, and broad E2E still need work.

This branch is a reconstruction starting point, not a production-ready release.
