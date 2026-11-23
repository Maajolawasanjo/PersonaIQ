# Phase 4 — Dashboard, Activity and Progress rebuild

Working branch: `audit/phase-0-1-trust-and-flow-fixes` (draft PR #1)
Implementation checkpoint: `1317fda0dbb813b6db873bb94988c5e831712c75`
Date: 2026-11-23

## Scope and changes

### Dashboard overview
- Replaced the overpopulated quick-actions layout with one clear primary action,
  a context-sensitive preparation card, verified account counts, useful tool
  destinations, and recent activity.
- The active draft opens the actual saved journey detail, rather than relying
  on a potentially stale localStorage step in the dashboard itself.
- User-specific metrics now show: total saved preparations, completed records,
  and most recently active saved journey.
- Dashboard recent activity comes from the backend, scoped to authenticated
  account ownership, excluding soft-deleted records.
- Removed the backend's fictional `+4% Presence Index Improvement` trend.
- Unverified historical Presence Index values are not surfaced as progress
  measurements, and null is used instead of fabricated zero.
- Added cohesive loading skeletons, failure/retry controls and first-use empty
  state, consistent with the Phase 2 design system.

### Activity archive
- Added an API client method that preserves real backend pagination metadata.
- The Activity screen requests pages of 12 rather than truncating at the first
  50 journeys, with previous/next controls and total results.
- Status filters query the backend; search is deliberately labeled as limited
  to the current page until server-side search exists.
- Archiving waits for backend confirmation and refetches the source of truth.
- Added consistent human-readable statuses and dates; no measured scores
  are displayed without verified provenance.
- Backend history queries now exclude soft-deleted journeys, use stable
  ordering, and require the current account's ownership.

### Progress and saved reports
- Removed dependency on legacy Presence DNA score fields in the Progress screen.
  Only real journey counts and factual guidance are shown.
- Saved Plans lists real report records with the journey's actual title and
  persisted status, not placeholder images, scores or testimonials.
- List endpoint is owner-scoped, excludes deleted journeys, and sorts newest
  reports first; legacy unverified numeric scores are omitted from its response.
- Saved journey detail hides unverified Presence Index figures and labels
  historical report text with appropriate limitations.
- Archived journeys are read-only and cannot be resumed; their previously
  saved reports can still be viewed.
- A completed journey with an unavailable plan still shows its own details
  rather than failing to load the entire page.

### Navigation and setup
- Incomplete account onboarding is redirected back to setup from Dashboard,
  Wardrobe (shared layout), and Journey layouts.
- Extended the CI static route-integrity check to cover dashboard, Activity,
  Progress, Saved Plans and journey detail links.

## Automated verification

The normal CI workflow validates backend pytest, frontend TypeScript and
Next.js build, workspace link integrity, Python dependencies and JavaScript
dependency audit. Phase 4 adds regression coverage for:
- Real overview counts, recent owned journeys and absence of artificial trends.
- Archived journeys excluded from current active draft.
- Pagination metadata and archived status filtering.
- Saved reports bound to the correct account, with no unsupported scores.
- Soft-deleted journeys hidden from dashboard, history and detail routes.

Run the latest CI for this branch before declaring all of these checks green;
past successful runs do not certify newer commits.

## Outstanding checks before merge

1. Browser-test desktop sidebar, tablet layout, 320px/375px mobile screens,
   focus navigation, 200% zoom and responsive card hierarchy.
2. Test first-use, many-journey (>50), archived, legacy-completed and
   service-unavailable accounts against a real staging database.
3. Confirm saved draft resumption restores the correct journey and step
   across browsers; localStorage-based draft-step memory remains a Phase 5
   journey-lifecycle limitation.
4. Implement server-side full-history search if needed; current search only
   covers the loaded page and states that explicitly.
5. Validate all historical reports and AI provider claims. Completed database
   state is not proof of verified AI score provenance.
6. Complete private media storage and SMTP configuration and broader Phase 1/3
   production security gates.

## Release decision

**Phase 4 code is committed to a draft branch, not production.** Automated
checks alone are insufficient to claim the visual redesign is fully tested.
No production promotion or merge is authorized at this stage.
