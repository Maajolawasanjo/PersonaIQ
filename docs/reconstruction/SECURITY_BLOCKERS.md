# PERSONAIQ — security and release blockers

Reviewed: 2026-11-23
Branch: audit/phase-0-1-trust-and-flow-fixes (draft PR #1)

## Dependencies — blocking release

Mandatory pnpm audit --audit-level high still fails. The initial gate
reported 29 findings: 3 critical, 15 high and 11 moderate.

Examples from audit logs: next@15.5.23 (patch >=15.5.28),
sharp@0.34.5 (patch >=0.35.5), effect@3.21.0
(patch >=3.22.1), plus js-yaml, brace-expansion and source-map-js.

**Required:** Upgrade compatible packages, regenerate pnpm-lock.yaml
using a registry-connected machine, rerun all automated and browser
tests, then require a clean security audit before merging.
Dependabot configuration alone does not fix existing vulnerabilities.

## Authentication — code migrated, runtime QA outstanding

Browser API requests now use same-origin /api/backend/*.
The Next.js server sets HttpOnly, SameSite=Lax access and refresh cookies,
forwards authenticated API requests, and refreshes credentials on the server.
Raw JWTs are no longer exposed by login responses or stored by the browser.

The proxy performs origin checks for unsafe requests and restricts refresh
and logout to POST. The middleware only provides a navigation redirect:
backend authorization, ownership and expiration checks remain essential.

**Required:** Verify deployed cookie attributes, login, registration,
password recovery, logout, stale refresh-token rotation, cross-tab refresh
races, CSRF, and stolen-token/revocation behavior in a real browser.
Old browser sessions may need to sign in again.

## Sensitive media — code protected, live setup outstanding

Backend changes:
- Uploads require a non-public Supabase Storage bucket and server-only
  service-role credential; production never silently falls back to local files.
- Stored records use internal references rather than public media URLs.
- Authenticated ownership checks are required to issue temporary signed links.
- The photo check and style-preparation UI no longer claim medical or
  psychological diagnosis from image pixels.
- Browser screens no longer persist raw selfie data URLs in localStorage.

**Required for a dedicated PERSONAIQ Supabase project:**
1. Configure the personaiq-uploads bucket with public=false.
2. Inventory and migrate/remove any previously public portrait objects.
3. Configure backend SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
   SUPABASE_STORAGE_BUCKET, ENVIRONMENT=production, a unique SECRET_KEY,
   and trusted FRONTEND_URL/CORS_ORIGINS.
4. Verify staging uploads, signed links, ownership and retention.
5. Implement object deletion during account deletion; database record
   deletion alone does not remove stored blobs. Set clear retention rules.

The connected Supabase account did not list PERSONAIQ. No live bucket
policy or historical photo migration was changed or verified.

## AI integrity — intentionally blocked

Analysis without submitted user media fails with a validation error.
Unconfigured providers no longer fabricate skin results, outfit rankings,
or LLM recommendations. Verified outfit comparison remains disabled and
returns an explicit unavailable response until a real provider is integrated.
Existing historical Presence Plans might contain synthetic data and require
provenance checks before reuse.

## Release rule

Keep this PR in draft. Do not merge to main or deploy publicly until the
dependency security gate is clean, private storage is live and verified,
provider results are authentic, and user journeys pass end-to-end QA.
A successful build and backend test suite alone are not release approval.
