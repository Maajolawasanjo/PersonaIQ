# Phase 3 — Authentication, onboarding and account lifecycle

Draft branch: `audit/phase-0-1-trust-and-flow-fixes`
Code checkpoint: `9e0a39b48407c856b752686f3d63872a05ed97ee`
Date: 2026-11-23

## Implemented

### Registration and email verification
- New accounts are stored as **unverified**, and the registration API does not issue an access or refresh token.
- Backend generates a six-digit, 10-minute verification challenge.
- The database stores a keyed digest of that code, not the code itself.
- Email must be delivered successfully before registration returns success;
  production registration fails closed when SMTP is disabled or unconfigured.
- `POST /auth/verify-otp` validates the challenge and creates a server-backed session only after verification.
- `POST /auth/resend-otp` supports a 60-second cooldown and a generic response that does not disclose account existence.
- Invalid OTP attempts trigger a per-account temporary lock after five failures.
- Unverified users cannot sign in, refresh sessions or access protected APIs.
- Old accounts that were auto-verified before this change remain verified.

### Login, sessions and recovery
- Login routing respects onboarding status and sanitizes redirect destinations.
- The original 30-day "Remember me" switch and artificial server warmup/retry animation were removed.
- The app distinguishes an unauthenticated session from a temporarily unavailable backend and provides retry UI instead of treating outages as sign-outs.
- Password reset tokens are stored as SHA-256 digests, expire in 30 minutes and cannot be reused.
- Password-reset and password-change workflows revoke outstanding refresh tokens.
- Repeated wrong passwords are persisted and cause a temporary account lockout.
- The Security page now shows actual refresh-session records and supports revocation without inventing a "current device" identity.
- Changing a password signs the browser out, requiring fresh credentials.
- The legacy 2FA page no longer falsely claims a working second-factor challenge.

### Onboarding and user experience
- Account setup uses a backend PATCH request instead of a timed success animation.
- Default event preference is created and persisted for newly registered users.
- A previously completed account setup redirects to the dashboard.
- Signup, OTP, login, recovery, account setup and security screens use accurate server-confirmed states and error handling.
- Public draft Terms of Use and Privacy Information pages are reachable from signup; legal approval remains required.
- False claims about zero photo retention, guaranteed encryption configuration, and mandatory 2FA were removed from auth pages.

## Automated checks

- Backend tests cover pending registration, OTP validation and replay, OTP lockout, resend cooldown, sign-in after verification, login lockout, password reset, reset token revocation and replay, onboarding persistence, protected profile and session revocation.
- The normal CI pipeline runs backend tests, frontend TypeScript/build, navigation route integrity and Python/JS dependency audits.
- CI success is required for the latest functional commit before marking the code verified.

## Not yet validated / production blockers

1. **SMTP delivery**: A verified production or staging mail provider is required. Mocked CI delivery is not proof that real messages arrive or have correct SPF/DKIM/DMARC.
2. **Browser E2E**: Registration → email receipt → verification → onboarding → dashboard, wrong/expired OTP, password recovery, refresh rotation, logout and account deletion need actual browser tests.
3. **Cross-instance refresh races**: Concurrent refresh requests can race across serverless instances. Test and design a consistent rotation strategy before general release.
4. **Rate limiting**: The current in-memory per-IP limiter is not a distributed rate limiter. A shared limiter and abuse/credential-stuffing protections are still needed.
5. **Access-token revocation**: Revoking refresh sessions stops new refreshes, but previously issued access tokens may remain valid until their normal expiry (15 minutes).
6. **Two-factor authentication**: Account verification is not equivalent to optional or mandatory sign-in MFA. The latter is not implemented.
7. **Legal and storage**: Final terms and privacy notice, real private Supabase storage, retention and third-party provider settings need approval/verification before release.

## Release rule

No production merge or public deployment from PR #1 until these checks pass.
