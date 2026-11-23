# Phase 2 — Unified workspace and route architecture

Working branch: `audit/phase-0-1-trust-and-flow-fixes` (draft PR #1)
Baseline: `1f4ce879879af1354dd4cd95e9372da719fed431`
Latest functional commit: `543011ac945008fbf0d1af4d480402b7171db629`

## Implemented

- Introduced one route manifest for primary, account, and mobile navigation.
- Replaced the noisy desktop dashboard sidebar with grouped, purpose-driven
  navigation, removing badges claiming unfinished features are "new."
- Consolidated the responsive sidebar and 4-tab-plus-More mobile navigation.
  The More panel includes keyboard Escape handling and a focus boundary.
- Built a focused, white-surface journey layout with a step indicator and exit,
  removing duplicated seven-item mobile navigation and false privacy badges.
- Kept PersonaIQ red and Geist typography; added missing Tailwind primitive
  tokens and normalized reusable buttons, inputs, focus states, and scrollbars.
- Removed page-wide typography and minimum width rules that caused cramped
  layout and oversized interactive elements.
- Rebuilt Settings into a single readable hub with accurate route links.
- Replaced the false-success account deletion link with a typed confirmation,
  current-password reauthentication enforced by FastAPI, and explicit backend
  completion before showing a deletion-confirmed page.
- Corrected connected-account, billing, appearance, and accessibility screens
  that previously used local-only toggles or ungrounded subscription claims.
- Rebuilt Saved Plans on the real list response with accurate empty/error states
  and no hardcoded images or scores.
- Redirected legacy Presence DNA analytics to the canonical Progress screen,
  removing fabricated performance charts and awards.
- Removed fixed-percentage preparation boosts; a verified provider is required
  before that API can report success.
- Added an automated route-integrity script and a mandatory CI check for the
  shared navigation and Settings links.

## Automated verification

- Latest functional commit: GitHub Actions backend pytest, frontend TypeScript,
  production build, workspace route check, and Python/JS dependency audits
  **all passed** on the draft branch.
- Account deletion tests now cover missing and incorrect passwords, photo
  cleanup success, and failed cleanup.
- No changes were merged into main or promoted to production.

## Manual browser acceptance checks still required

- Verify 320px, 375px, tablet, laptop and ultrawide viewport layouts.
- Confirm the mobile More dialog focus behavior, ESC closing, link transitions,
  scroll containment and screen-reader announcements.
- Test dashboard/sidebar active states, profile/logout, history and settings.
- Validate journey progress when some steps are skipped or resumed.
- Test account deletion with legitimate backend data, wrong password,
  storage errors and redirection.
- Verify deployed cookies, CORS settings, private media and AI integration
  through a dedicated staging environment.
- Audit other feature screens for remaining legacy hardcoded statistics.

## Next work

Phase 3: Full authentication lifecycle and onboarding with verified browser
flows. Phase 1's live Supabase/private media and real-provider dependencies
remain production release blockers.

Do not merge this draft PR until the outstanding real-browser and live-integration
checks are completed.