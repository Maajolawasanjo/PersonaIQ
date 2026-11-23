# PERSONAIQ — Critical outstanding release blockers

Last reviewed: 2026-11-23
Working branch: audit/phase-0-1-trust-and-flow-fixes

## Dependencies — unresolved

The enforced CI gate `pnpm audit --audit-level high` fails. The first diagnostic run reported 29 dependency advisories (3 critical, 15 high, 11 moderate). These findings have **not been remediated** by simply introducing the audit gate.

Noted vulnerable dependency chains from GitHub Actions:
- `next@15.5.23` — advisories require at least `15.5.28` for one listed App Router DoS issue.
- `sharp@0.34.5` — advisory lists a fix at `0.35.5`.
- `effect@3.21.0` via Prisma configuration — advisory lists `3.22.1` as patched.

Upgrade and regenerate `pnpm-lock.yaml` in a registry-connected environment, confirm compatible Next.js, Prisma and sharp versions, then run full CI, `pnpm audit`, E2E and preview checks. Do not bypass the security gate. Dependabot is configured to propose updates, but that alone is not remediation.

## Authentication and portrait data — unresolved

- Access and refresh JWTs are still persisted in browser JavaScript-readable storage. Migrate to an appropriately designed server-session / HttpOnly-cookie architecture with explicit CSRF and refresh handling, then test against stolen/replayed tokens.
- Existing Supabase portrait uploads currently construct publicly accessible URLs and fallback to local filesystem. A private bucket, policy-enforced access, lifecycle/retention, access-controlled retrieval and deletion must be implemented before accepting sensitive real user photos.
- Production `SECRET_KEY` is now validated against the default but actual Render environment values have not been audited.
- Vercel preview and production CORS origins must be configured explicitly in the backend.

## Assessment integrity — intentionally blocked

- Missing user media now fails with a 422 validation error, rather than defaulting to fake images.
- YouCam provider no longer produces fallback skin scores on authentication/network failures.
- Outfit comparison is explicitly unavailable (503) until a real provider/rubric is implemented.
- Model failures no longer trigger fabricated Featherless recommendations.
- Legacy stored Presence Plans may contain simulated metrics and require provenance/version tagging before they can be treated as verified assessments.

## Release policy

This is a draft PR. Do not merge to `main` or promote the preview into production until the security gate, functional tests, privacy safeguards, and core user journeys are verified. A successful frontend build alone is insufficient.
