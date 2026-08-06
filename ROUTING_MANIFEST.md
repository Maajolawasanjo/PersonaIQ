# 🗺️ PersonaIQ Living Routing Manifest & Screen Registry

This manifest serves as the single source of truth for navigation, UX flow, routing architecture, and security guards across all **65 screens** of the PersonaIQ enterprise platform.

---

## 📊 Complete 65-Screen Routing Matrix

| # | Screen Name | Route | Previous Screen(s) | Next Screen(s) | Auth Guard | UX Purpose / State | Status |
|---|-------------|-------|--------------------|----------------|------------|---------------------|--------|
| 1 | Public Landing | `/` | — | `/login`, `/signup`, `/demo`, `/how-it-works` | Public | Public value proposition & platform overview | Active ✓ |
| 2 | Features Overview | `/features` | `/` | `/login`, `/pricing` | Public | Feature deep-dive & AI capabilities | Active ✓ |
| 3 | How It Works | `/how-it-works` | `/`, `/features` | `/signup`, `/demo` | Public | Academic methodology & AI pipeline explanation | Active ✓ |
| 4 | Pricing & Plans | `/pricing` | `/` | `/signup`, `/checkout` | Public | Subscription tiers & enterprise licenses | Active ✓ |
| 5 | FAQ & Support | `/faq` | `/` | `/contact` | Public | Frequently asked questions & knowledge base | Active ✓ |
| 6 | Contact Sales/Support | `/contact` | `/faq`, `/` | `/` | Public | Support form & enterprise inquiries | Active ✓ |
| 7 | Interactive Demo | `/demo` | `/`, `/how-it-works` | `/signup` | Public | Live sandbox trial of Presence Index™ | Active ✓ |
| 8 | Sign In | `/login` | `/`, `/signup` | `/dashboard`, `/forgot-password`, `/2fa` | Public | Institutional authentication & SSO | Active ✓ |
| 9 | Join PersonaIQ | `/signup` | `/`, `/login` | `/verify-email` | Public | Account registration & password security | Active ✓ |
| 10 | Forgot Password | `/forgot-password` | `/login` | `/email-sent` | Public | Account recovery link request | Active ✓ |
| 11 | Email Sent Notice | `/email-sent` | `/forgot-password`, `/signup` | `/login` | Public | Confirmation notice for outbound email | Active ✓ |
| 12 | Reset Password | `/reset-password` | `/email-sent` | `/login` | Public | Secure token-based password reset form | Active ✓ |
| 13 | Verify Email | `/verify-email` | `/signup` | `/onboarding` | Public | 6-digit email OTP verification | Active ✓ |
| 14 | Two-Factor Auth (2FA) | `/2fa` | `/login` | `/dashboard` | Public | TOTP authenticator verification | Active ✓ |
| 15 | Account Locked | `/account-locked` | `/login` (5 failures) | `/support` | Public | Security lockout notice with recovery options | Active ✓ |
| 16 | Onboarding Wizard | `/onboarding` | `/verify-email`, `/signup` | `/journey/start`, `/dashboard` | Protected | 5-step workspace calibration sequence | Active ✓ |
| 17 | Journey Start Screen | `/journey/start` | `/dashboard`, `/onboarding` | `/journey/event-type` | Protected | Introduction to Presence Journey execution | Active ✓ |
| 18 | Event Type Selector | `/journey/event-type` | `/journey/start` | `/journey/dress-code` | Protected | Context calibration (Boardroom, Keynote, Pitch) | Active ✓ |
| 19 | Dress Code Selector | `/journey/dress-code` | `/journey/event-type` | `/journey/capture-look` | Protected | Baseline standard selection (Formal, Casual) | Active ✓ |
| 20 | Capture Look / Upload | `/journey/capture-look` | `/journey/dress-code` | `/journey/validation` | Protected | Real-time webcam feed or media drag-and-drop | Active ✓ |
| 21 | Image Validation | `/journey/validation` | `/journey/capture-look` | `/journey/skin-intelligence` | Protected | Frame clarity & lighting verification | Active ✓ |
| 22 | Skin Intelligence | `/journey/skin-intelligence` | `/journey/validation` | `/journey/choose-outfit` | Protected | Hydration & vitality reflectance matrix | Active ✓ |
| 23 | Choose Outfit | `/journey/choose-outfit` | `/journey/skin-intelligence` | `/journey/virtual-tryon` | Protected | Wardrobe recommendation matcher | Active ✓ |
| 24 | Virtual Try-On | `/journey/virtual-tryon` | `/journey/choose-outfit` | `/journey/persona-engine` | Protected | Side-by-side AR suit comparison | Active ✓ |
| 25 | Preparing Workspace | `/journey/persona-engine` | `/journey/virtual-tryon` | `/journey/summary` | Protected | Processing loading state & tensor execution | Active ✓ |
| 26 | Journey Summary | `/journey/summary` | `/journey/persona-engine` | `/journey/explanation`, `/journey/export` | Protected | Winning look, index score 92 & analysis | Active ✓ |
| 27 | Detailed AI Explanation | `/journey/explanation` | `/journey/summary` | `/journey/summary`, `/dashboard` | Protected | AI logic trace & expected lift metrics | Active ✓ |
| 28 | Compare Journeys | `/journey/compare` | `/journey/summary`, `/dashboard` | `/dashboard/history` | Protected | Side-by-side initial vs final score growth | Active ✓ |
| 29 | Export Presence Plan | `/journey/export` | `/journey/summary` | `/journey/share` | Protected | Live PDF/PNG preview & print generator | Active ✓ |
| 30 | Share Success | `/journey/share` | `/journey/export`, `/journey/summary` | `/dashboard` | Protected | Achievement share modal & copyable link | Active ✓ |
| 31 | Presence Boost Screen | `/journey/presence-boost` | `/journey/summary` | `/dashboard` | Protected | High-stakes micro-coaching checklist | Active ✓ |
| 32 | Presence Checklist | `/journey/checklist` | `/journey/presence-boost` | `/dashboard` | Protected | Pre-event physical readiness checklist | Active ✓ |
| 33 | Executive Dashboard | `/dashboard` | `/login`, `/onboarding`, `/journey/share` | `/journey/start`, `/dashboard/history`, `/dashboard/presence-dna` | Protected | Executive telemetry hub (Zero-State & Active toggle) | Active ✓ |
| 34 | Personal Archive / DNA | `/dashboard/presence-dna` | `/dashboard` | `/dashboard/history` | Protected | Longitudinal growth, vocal confidence & YTD trends | Active ✓ |
| 35 | Progress Telemetry | `/dashboard/progress` | `/dashboard` | `/dashboard/presence-dna` | Protected | Longitudinal tracking & milestone badges | Active ✓ |
| 36 | Journey History Timeline | `/dashboard/history` | `/dashboard` | `/dashboard/history/[id]` | Protected | Chronological archive & empty state view | Active ✓ |
| 37 | Journey Details | `/dashboard/history/[id]` | `/dashboard/history` | `/dashboard/history` | Protected | Granular event archive & outfit rationale | Active ✓ |
| 38 | Plans & Billing | `/dashboard/plans` | `/dashboard` | `/pricing` | Protected | Active tier & seat management | Active ✓ |
| 39 | User Profile | `/dashboard/profile` | `/dashboard/settings` | `/dashboard/settings` | Protected | Executive identity, bio & institution | Active ✓ |
| 40 | Settings Main Hub | `/dashboard/settings` | `/dashboard` | `/dashboard/settings/privacy`, `/dashboard/settings/appearance`, `/dashboard/settings/notifications`, `/dashboard/settings/accounts` | Protected | Settings hub for system preferences | Active ✓ |
| 41 | Privacy Settings | `/dashboard/settings/privacy` | `/dashboard/settings` | `/dashboard/settings` | Protected | Media retention & data sovereignty controls | Active ✓ |
| 42 | Appearance Settings | `/dashboard/settings/appearance` | `/dashboard/settings` | `/dashboard/settings` | Protected | Themes, typography slider & density controls | Active ✓ |
| 43 | Notification Preferences | `/dashboard/settings/notifications` | `/dashboard/settings` | `/dashboard/settings` | Protected | Email, push & journey alert toggles | Active ✓ |
| 44 | Connected Accounts | `/dashboard/settings/accounts` | `/dashboard/settings` | `/dashboard/settings` | Protected | Google, GitHub, Microsoft 365, Apple OAuth | Active ✓ |
| 45 | Camera Access Required | `/system/camera` | `/journey/capture-look` | `/journey/capture-look` | Protected | Camera permission prompt & fallback | Active ✓ |
| 46 | Module in Review (Coming Soon) | `/system/coming-soon` | Any experimental route | `/dashboard` | Protected | Academic review & feature preview modal | Active ✓ |
| 47 | System Maintenance | `/system/maintenance` | Any system route | `/system/maintenance` | Public | Recalibration & maintenance alert | Active ✓ |
| 48 | Offline Mode | `/system/offline` | Offline detection | `/dashboard` | Public | Cached data viewer & draft access | Active ✓ |
| 49 | No Internet Connection | `/system/no-internet` | Network drop | `/system/offline` | Public | Network retry & local cache trigger | Active ✓ |
| 50 | Analysis Interrupted | `/system/analysis-interrupted` | `/journey/persona-engine` | `/journey/persona-engine` | Protected | Pipeline error recovery & retry trigger | Active ✓ |
| 51 | Upload Failed | `/system/upload-failed` | `/journey/capture-look` | `/journey/capture-look` | Protected | Unsupported MIME format exception | Active ✓ |
| 52 | Session Expired | `/session-expired` | Idle timeout | `/login` | Public | Inactivity re-authentication form | Active ✓ |
| 53 | Browser Not Supported | `/system/browser-not-supported` | Browser check | `/dashboard` | Public | Alternative browser recommendations | Active ✓ |
| 54 | Account Deleted | `/system/account-deleted` | `/dashboard/settings/privacy` | `/` | Public | Permanently purged feedback confirmation | Active ✓ |
| 55 | Global 404 Not Found | `/not-found` | Invalid URL | `/dashboard` | Public | Index not found error boundary | Active ✓ |
| 56 | Global 500 Error | `/error` | System exception | `/dashboard` | Public | Server anomaly diagnostic hash boundary | Active ✓ |
| 57 | Loading Suspense State | `/loading` | Routing transition | Destination | Public | Universal skeleton fallback | Active ✓ |
| 58 | System Index Fallback | `/system` | `/system/*` | `/dashboard` | Public | Fallback directory index | Active ✓ |
| 59 | Terms of Service | `/terms` | Footer | `/privacy` | Public | Legal terms & conditions | Active ✓ |
| 60 | Privacy Policy | `/privacy` | Footer | `/terms` | Public | Data processing policy | Active ✓ |
| 61 | Security Architecture | `/security` | Footer | `/contact` | Public | SOC2 & TLS security documentation | Active ✓ |
| 62 | Academic Research | `/research` | Footer | `/how-it-works` | Public | MIT-inspired research papers & citations | Active ✓ |
| 63 | Executive Telemetry | `/telemetry` | `/dashboard` | `/dashboard` | Protected | Real-time cognitive load telemetry | Active ✓ |
| 64 | Wardrobe Library | `/wardrobe` | `/dashboard` | `/journey/choose-outfit` | Protected | Saved executive clothing items | Active ✓ |
| 65 | System Status Log | `/status` | Footer | `/system/maintenance` | Public | Real-time server health & uptime log | Active ✓ |

---

## 🔒 Security & Route Guards Specification

1. **Guest Routes**: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/demo`, `/how-it-works`, `/pricing`, `/features`, `/faq`, `/contact`. If an authenticated session exists, accessing `/login` or `/signup` automatically redirects to `/dashboard`.
2. **Protected Routes**: `/dashboard/*`, `/journey/*`, `/system/camera`, `/system/analysis-interrupted`, `/system/upload-failed`. If no active token is detected, request is redirected to `/login?redirect=[target]`.
3. **Fallback Handlers**:
   - `404 Not Found` → `/not-found` with branded recovery action back to `/dashboard` or `/`.
   - `500 Server Anomaly` → `/error` with diagnostic trace ID generator and retry button.
