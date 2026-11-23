# PERSONAIQ — Reconstruction release checklist

Last reviewed: 2026-11-23  
Working branch: audit/phase-0-1-trust-and-flow-fixes  
Pull request: #1 (draft, production unchanged)

## Verified automated gates

The full GitHub Actions CI pipeline passed on commit c78eaa7:
- Backend pytest suite — passed
- Frontend TypeScript check and Next.js production build — passed
- JavaScript dependency audit at high severity — passed
- Python dependency audit — passed

Dependencies were updated to compatible patched versions with a regenerated
pnpm-lock.yaml, including Next.js 15.5.29. The dependency-repair workflow
tested the resolution and build before creating the dependency commit.
Review the remaining dependency overrides when dependencies next change.

## Authentication — implementation complete, live E2E pending

- Next.js same-origin proxy now holds access/refresh credentials in HttpOnly
  session cookies and excludes them from browser JSON and localStorage.
- Authentication refresh and backend authorization remain server-side.
- Request-origin checks cover unsafe methods; middleware is a navigation
  helper, not a replacement for backend authorization.
- Still required: deployed cookie audit, account recovery and logout testing,
  cross-tab rotation, invalid/expired sessions and CSRF tests using real
  browsers and deployed backend configuration.

## Media privacy — code prepared, live storage not yet verified

- Portrait and outfit uploads require a non-public Supabase bucket in
  production and a server-side service-role credential. No silent public or
  filesystem fallback is permitted.
- Records use internal private-media references and short-lived links, subject
  to user/journey ownership checks.
- Sensitive selfie data URLs are no longer stored in browser localStorage.
- Account deletion enumerates owned uploaded media and requests file removal
  before deleting database records; storage errors block completion.
- Regression tests cover account deletion with successful and failed cleanup,
  cross-account paths and private storage signing.

STILL REQUIRED:
1. Create/verify a dedicated PERSONAIQ Supabase project and non-public
   personaiq-uploads bucket; the connected Supabase account does not list one.
2. Configure the production Render media credentials, strong token secret and
   trusted frontend origins without exposing keys to browsers.
3. Migrate or remove any legacy publicly stored photos, configure media
   retention and audit all third-party generated VTO image retention.
4. Validate upload/download, deletion, signed-link expiry, storage provider
   errors and cross-user privacy against a real staging deployment.

## AI integrity — outstanding provider dependency

The analysis flow now refuses missing media and unverified provider results.
Outfit comparison is disabled and returns 503 instead of fictional results.
A real tested comparison provider, meaningful report provenance, and
historical-plan validation are still required before release.

## Public communication

The FAQ has been corrected to remove unsupported claims about instant image
deletion, diagnostic skin measurements, guaranteed processing speed and
an authentication vendor that was not actually integrated.

Other marketing copy, pricing, legal documents and all onboarding screens
still need a final consistency and compliance review.

## Production release rule

**Do not merge or deploy this draft PR yet.** Automated checks are green,
but the live private storage integration, provider availability, security
browser tests, complete user-journey E2E verification and deployment
configuration are outstanding. No functional claim should be inferred
solely from a successful CI build.
