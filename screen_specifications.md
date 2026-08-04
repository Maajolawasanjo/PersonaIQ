# PersonaIQ
# Complete Screen Specification

**Document ID:** PIQ-DESIGN-002

**Purpose**
This document defines every screen, interaction, transition, and navigation path in PersonaIQ.
Every screen should follow one visual language, one design system, and one interaction philosophy.
The experience should feel like one continuous journey.

---

# SCREEN COUNT

```
Marketing Website         06
Authentication            05
Onboarding                05
Dashboard                 06
Presence Journey         19
Results                   05
History                   03
Settings                  06
System States            10
--------------------------------
TOTAL = 65 SCREENS
```

---

# FLOW 01
# MARKETING WEBSITE

The marketing website should feel like Apple's product pages combined with Stripe's editorial layouts and Linear's minimalism.
The purpose is not to sell. The purpose is to build trust.

## SCREEN 01
### Landing Page

**Objective:** Create an unforgettable first impression within the first five seconds.
The visitor should immediately understand: What PersonaIQ is, Who it is for, Why it matters, What action to take next.

**Layout:**
Sticky Navigation
↓
Hero
↓
Trusted Technology
↓
Problem Section
↓
Solution Section
↓
Interactive Product Preview
↓
Features Grid
↓
How It Works
↓
Presence Journey Preview
↓
Testimonials (Future)
↓
FAQ
↓
Final CTA
↓
Footer

**Hero Section Layout:**
Left: Headline, Subheadline, Primary CTA, Secondary CTA, Trust Badges
↓
Right: Interactive Product Mockup, Animated Presence Score, Outfit Comparison, Skin Analysis Preview

**Headline:**
Large. Bold. Confident. Minimal.
*Example:* > **Own Your First Impression.** or > **Build Your Presence. Own Every Moment.**
Maximum: Two lines.

**Supporting Text:**
One paragraph. Explain the value in under 30 words.
*Example:* > Prepare for interviews, meetings, networking events, and life's biggest moments with AI-powered skin intelligence, outfit recommendations, and personalized presence coaching.

**Primary CTA:** Start Your Presence Journey (Large, MIT Red, Rounded, High emphasis)
**Secondary CTA:** Watch Demo (Ghost Button)

**Hero Illustration:**
DO NOT use stock illustrations. Instead show a live application mockup.
Mockup should include: Presence Index, AI Recommendation Card, Outfit Comparison, Progress Timeline

**Navigation:**
Logo, Features, How It Works, FAQ, Sign In, Get Started

**Visual Direction:**
Large whitespace, Premium spacing, Large typography, Soft shadows, Rounded cards, Thin borders, Editorial layouts

**Motion:**
Hero mockup slowly animates. Presence score counts upward. Cards gently fade in. Buttons subtly scale on hover. Nothing flashy.

**Mobile:** Stack vertically. Hero first. Mockup below. Buttons full width.
**Desktop:** Split layout. 45% / 55%
**Success Criteria:** The user understands the product within five seconds.

---

## SCREEN 02
### Features

**Purpose:** Explain capabilities. Not technology. Every feature should answer: "What can I achieve?"
**Layout:** Section Heading ↓ Six Feature Cards ↓ Large Highlight Card ↓ CTA
**Feature Cards:** Each card contains: Icon, Title, Description, Benefit, Hover interaction
**Suggested Features:** Presence Scan™, Style Compare™, Presence Index™, Presence Boost™, Best Presence Plan™, Journey History™
Cards should be reusable.

---

## SCREEN 03
### How It Works

**Purpose:** Reduce uncertainty. Show how easy the experience is.
**Layout:** Heading ↓ Timeline ↓ Step Cards ↓ Animated Journey
**Four Steps:**
1. Tell us your event
2. Upload your look
3. AI analyzes everything
4. Receive your Presence Plan
Every step should include: Illustration, Description, Estimated Time

---

## SCREEN 04
### Interactive Demo

**Purpose:** Show the product before signup. This should be one of the strongest sections.
The user scrolls through a simulated Presence Journey.
Step 1: Interview Context ↓ Step 2: Upload Photo ↓ Step 3: Skin Analysis ↓ Step 4: Outfit Comparison ↓ Step 5: Presence Plan
Cards animate as the user scrolls.

---

## SCREEN 05
### FAQ

**Purpose:** Remove objections.
**Suggested Questions:** What happens to my photos? How accurate is PersonaIQ? Can I use it for interviews? Does it diagnose skin conditions? How long does analysis take? Is my data private?

---

## SCREEN 06
### Footer

Should feel like Vercel. Minimal.
**Sections:** Product, Company, Resources, Legal, Social, Newsletter (future)

---

# FLOW 02
# AUTHENTICATION

This flow should feel effortless. No distractions. No marketing. No unnecessary text.

## SCREEN 07
### Sign In

**Purpose:** Get the user into the product as quickly as possible.
**Layout:** Centered authentication card. Logo. Welcome message. Google Sign In, GitHub Sign In, Continue as Guest, Divider, Privacy notice.
**Visual Style:** Soft background. Rounded container. Minimal. Elegant.
**CTA Priority:** Google, GitHub, Guest
**Animation:** Card fades in. Buttons animate on hover.
**Success:** Dashboard.

---

## SCREEN 08
### Create Account

**Purpose:** New users. Same layout as Sign In.
Only additional elements: Name, Email, Terms, Privacy acceptance

---

## SCREEN 09
### Authentication Loading

**Purpose:** Reduce anxiety. Show progress.
**Layout:** Large logo. Animated spinner.
**Message:** Preparing your workspace…

---

## SCREEN 10
### Welcome

Celebrate successful sign in.
**Headline:** Welcome to PersonaIQ
**Illustration:** Minimal.
**Primary CTA:** Start First Presence Journey
**Secondary:** Explore Dashboard

---

## SCREEN 11
### Account Recovery (Future)

Simple email entry. Confirmation state. Minimal UI.

---

# FLOW 03
# DASHBOARD EXPERIENCE

> [!IMPORTANT]
> **CORE REASON FOR THE APP**  
> Flow 03 (Dashboard) and Flow 04 (Presence Journey) are the core differentiator for PersonaIQ. They must be developed with 100% completeness and the highest level of polish.

> The dashboard is not an analytics dashboard.
>
> It is a **Mission Control** for preparing important moments.

The user should immediately feel:
> "Everything I need is here."

## SCREEN 12
### Dashboard Home

**Purpose:** This is the user's home. Every important action starts here.
The dashboard should immediately answer: What am I preparing for? What should I do next? What have I already completed? What's my current Presence Score?

**Layout:**
Navbar ↓ Welcome Header ↓ Quick Actions ↓ Current Presence Card ↓ Upcoming Journey ↓ Recent Journeys ↓ Presence Insights ↓ Tips ↓ Footer

**Welcome Header:**
Left: Greeting (`Good Morning, Nathan 👋`), Below (`Prepare confidently for your next important moment.`)
Right: Avatar, Notification, Settings

**Quick Actions:**
Large cards. Maximum 4.
`+ Start New Journey`, `Resume Journey`, `History`, `PresenceDNA`
Each should feel tappable. Rounded. Premium.

**Current Presence Card (Hero Card):**
Contains: `Presence Index™ 86 Excellent`, `Confidence 92%`, `Updated Today`
Below: `Your interview preparation is looking strong. One recommendation remaining.`
Large CTA: `Continue Journey`

**Recent Journeys:**
Horizontal cards.
`Google Interview` (Completed Yesterday)
`Wedding` (Completed Last Week)
`Conference` (Draft)

**Presence Insights:**
Editorial card. Examples:
`You perform best in Business Casual.`
`Blue outfits consistently rank higher.`
`Morning lighting improves image quality.`

**Empty State:**
Illustration: `Your first journey starts here.`
Button: `Start Presence Journey`

**Motion:** Cards stagger in. Presence score counts up. Hover lift 2px.
**Navigation:** Dashboard, History, PresenceDNA, Settings

---

## SCREEN 13
### Journey History

**Purpose:** Give users confidence that PersonaIQ remembers progress.
**Layout:** Header ↓ Filters ↓ Journey List ↓ Timeline ↓ Load More
**Each Journey Card:** `Interview`, `Completed Aug 14`, `Score 91` ↓ `View Details`
**Filters:** Completed, Draft, Interview, Networking, Wedding, Presentation
**Search:** Top right.

---

## SCREEN 14
### PresenceDNA™

**Purpose:** The most unique page. This page should feel futuristic.
**Hero:** `Your PresenceDNA™ Generated from 17 Journeys`
**Contains:** Favorite Colors, Preferred Fits, Strongest Looks, Confidence Trends, Most Successful Styles, Professional Style Profile
**Visualization:** Circular radar chart. Personality-style cards. Editorial graphs.
**Recommendation:** `Your strongest professional presence comes from structured dark outfits.`

---

## SCREEN 15
### Saved Presence Plans

**Purpose:** Collection of saved recommendations.
**Layout:** Grid. Cards.
**Each Card:** `Interview` ↓ `Recommended Outfit` ↓ `Checklist` ↓ `Saved`

---

## SCREEN 16
### Profile

Large profile image. Statistics (`Journeys 28`, `Recommendations Followed 83%`, `Average Presence 89`). Editable information.

---

## SCREEN 17
### Dashboard Settings Shortcut

Simple overview. Privacy, Notifications, Appearance, Connected Accounts, Danger Zone.

---
# END FLOW 03
---

# FLOW 04
# PRESENCE JOURNEY

> [!IMPORTANT]
> **CORE REASON FOR THE APP**  
> Flow 03 (Dashboard) and Flow 04 (Presence Journey) are the core differentiator for PersonaIQ. They must be developed with 100% completeness and the highest level of polish.

This is the most important experience in PersonaIQ.
This should feel less like filling out forms… and more like completing a guided conversation.
Every step follows one structure: Header ↓ Progress ↓ Question ↓ Content ↓ Next Button
Only ONE task per screen.

---

## SCREEN 18
### Start Presence Journey

**Purpose:** Begin.
**Headline:** `Let's prepare for your next moment.`
**Description:** `Tell us about your event, and we'll build a personalized Presence Plan.`
**Large CTA:** `Start Journey`
**Secondary:** Learn More
**Illustration:** Minimal abstract shapes.

---

## SCREEN 19
### Event Type

**Purpose:** Understand context.
**Grid Cards:** Interview, Business Meeting, Networking, Conference, Presentation, Wedding, Graduation, Date, Other
Selecting one animates. Card expands. Checkmark appears.
**Bottom CTA:** Continue

---

## SCREEN 20
### Event Details

**Questions:** Event Name, Date, Time, Location, Dress Code, Industry, Importance
Rather than a long form, use progressive cards. Each field unfolds as the previous one is completed.
**Illustration:** Calendar. Clock. Location pin.
**Continue**

---

## SCREEN 21
### Dress Code

**Purpose:** Gather style expectations.
**Cards:** Business Formal, Business Casual, Smart Casual, Cocktail, Traditional, Black Tie, Casual, Not Sure
Choosing shows preview image.
**Continue**

---

## SCREEN 22
### Capture Your Look

This replaces "Upload Selfie". More human.
**Purpose:** Analyze current appearance.
**Headline:** `Let's see your current look.`
Large upload zone. Camera option. Drag & Drop. Supported formats.
**Privacy reassurance:** `Your images are securely processed and never shared.`
**Continue**

---

## SCREEN 23
### Image Validation

**Purpose:** Provide confidence before AI processing.
**Checklist:** ✓ Face detected ✓ Lighting good ✓ Resolution excellent ✓ Camera angle acceptable
If something fails, show improvement suggestions. Never red errors. Use encouraging language (`Move slightly closer to the camera.` instead of `Image invalid.`)
**Continue**

---

## SCREEN 24
### Presence Scan™

Processing Screen. This is NOT a spinner. It's an experience.
**Timeline:** Preparing image ↓ Analyzing skin ↓ Understanding context ↓ Building profile ↓ Almost done
Animated. Calm. Estimated time 8–12 seconds.
Large illustration. Subtle particles. Progress indicator. No percentage.

---

## SCREEN 25
### Skin Intelligence Results

This is the first "wow" moment.
**Layout:** Large face preview ↓ Overall Skin Summary ↓ Strengths ↓ Areas to improve ↓ Preparation Tips ↓ Continue
Avoid medical terminology. Focus on presentation.
*Example:* `Your skin appears well hydrated. Reducing under-eye fatigue may enhance your professional appearance for tomorrow's interview.`

---

## SCREEN 26
### Choose Your Outfit

**Purpose:** Upload one or more outfit options. Users can add multiple outfits.
**Grid layout. Each card:** Upload, Preview, Replace, Delete
**Large CTA:** `Compare Outfits`

---

## SCREEN 27
### Style Compare™

**Purpose:** Allow users to compare multiple outfit options using AI-powered virtual try-on.
This should feel premium and interactive—not like an image gallery.
**Screen Goal:** Help users confidently compare outfits before making a decision.

**Layout:**
Header ↓ Progress Stepper ↓ Selected Event Summary ↓ Virtual Outfit Gallery ↓ AI Quick Summary ↓ Compare Button

**Header:**
Title: `Style Compare™`
Subtitle: `Compare how each outfit fits your event before making a decision.`

**Main Area:**
Display uploaded outfits as large cards.
Each card contains: Outfit Preview, Outfit Name, Edit Button, Delete Button, Selection Indicator
Selecting a card expands it.

**Bottom CTA:**
Primary: `Start Virtual Try-On`
Secondary: `Add Another Outfit`

**Empty State:**
Illustration: `Add at least two outfits to begin comparison.`

**Motion:** Cards smoothly expand. Selection ring animates. Preview fades in.
**Navigation:** Previous (Choose Your Outfit), Next (Virtual Try-On)

---

## SCREEN 28
### Virtual Try-On™

**Purpose:** Generate realistic previews using YouCam Apparel VTO.
**Layout:** Progress Timeline ↓ Large Avatar Preview ↓ Outfit Carousel ↓ AI Status ↓ Continue

**Hero Area:** Large full-height avatar. Users swipe between outfits. Smooth crossfade transition.

**AI Status:** Instead of "Loading...", use intelligent updates.
*Examples:* `Generating realistic fit...` ↓ `Adjusting fabric drape...` ↓ `Matching lighting...` ↓ `Preparing comparison...`
**Estimated Time:** 6–10 seconds
**Motion:** Subtle breathing animation. Progress timeline. Crossfade between generated looks.
**Navigation:** Continue

---

## SCREEN 29
### Compare Looks

**Purpose:** Allow users to visually compare all generated outfits.
**Layout:** Comparison Header ↓ Large Side-by-Side Viewer ↓ AI Rankings ↓ Why? ↓ Continue

**Comparison View:**
Desktop: Three-column layout
Mobile: Swipe between outfits
Each Outfit Card Contains: Image, Rank, Confidence, Suitability, Quick Summary
*Example:* `Business Suit`, `95 Excellent Match`, `Confidence 96%`

**AI Summary:**
*Example:* `Outfit 2 aligns best with the expected dress code and creates a stronger professional first impression.`
**CTA:** `Generate My Presence Plan`

---

## SCREEN 30
### Persona Engine™

**Purpose:** Show the AI reasoning process. This is one of the signature experiences of PersonaIQ.
**Layout:** AI Visualization ↓ Thinking Timeline ↓ Decision Categories ↓ Processing

Instead of showing a spinner... Show reasoning.
*Examples:*
✓ Understanding event context
✓ Evaluating outfit suitability
✓ Reviewing presentation factors
✓ Prioritizing recommendations
✓ Building your Presence Plan

**Motion:** Timeline fills gradually. Nodes animate. No fake typing effects.
**Design Style:** Dark editorial card. Minimal. Premium.

---

## SCREEN 31
### AI Recommendations

**Purpose:** Present explainable recommendations.
**Layout:** Header ↓ Top Recommendation ↓ Supporting Recommendations ↓ Why This Matters ↓ Continue

**Each Recommendation Card Contains:** Priority, Recommendation, Impact, Estimated Time, Confidence, Reason
*Example:* `Iron your blazer before tomorrow's interview.`
`Impact: High`, `Confidence: 94%`, `Time Required: 5 minutes`, `Reason: Wrinkle-free clothing improves perceived professionalism.`
**CTA:** `View Presence Index`

---

## SCREEN 32
### Presence Index™

**Purpose:** Present a simple overall readiness score.
**Hero:** Large Circular Gauge `92 Presence Index™`
**Categories:** Appearance, Style, Event Match, Confidence, Preparation (Each has its own score).
**Summary:** `You're well prepared. Improving lighting for your selfie could increase confidence further.`
**CTA:** `View Presence Plan`

---

## SCREEN 33
### Presence Boosts™

**Purpose:** Show the highest-impact improvements.
**Layout:** Stacked cards.

**Each Card Contains:** Title, Expected Improvement, Difficulty, Time Required, AI Confidence
*Example:* `Polish your shoes`, `+3 Presence Points`, `Difficulty: Easy`, `Time: 2 Minutes`, `Confidence: 97%`
Cards sorted by: Highest impact, Lowest effort
**CTA:** `Apply Recommendations`

---

## SCREEN 34
### Best Presence Plan™

**Purpose:** This is the most valuable screen in the product. Everything leads here.
**Layout:** Hero ↓ Recommended Outfit ↓ Preparation Checklist ↓ Confidence Summary ↓ AI Explanation ↓ Export ↓ Save

**Hero:** Headline: `Your Best Presence Plan`
**Hero Image:** Winning outfit. Large. Editorial. Premium.
**Summary Card:** Presence Index, Expected Confidence, Recommended Arrival Time, Suggested Preparation Window

**AI Explanation:**
*Example:* `Based on your interview context, business formal expectations, lighting conditions, and outfit comparison, Outfit 2 provides the strongest overall professional presence.`

**CTA:** Primary: `Save Presence Plan`, Secondary: `Start Another Journey`

---

## SCREEN 35
### Preparation Checklist

**Purpose:** Convert recommendations into action.
**Checklist:**
✓ Steam blazer
□ Polish shoes
✓ Trim beard
□ Sleep before 11 PM
□ Pack documents
✓ Charge phone

**Progress:** 6 of 8 completed
**Completion animation:** Checkmarks animate. Progress bar fills.
**CTA:** `Complete Journey`

---

## SCREEN 36
### Journey Complete

**Purpose:** Celebrate progress. Not perfection.

**Hero Illustration:** Minimal. Elegant. Confetti is subtle—not flashy.
**Headline:** `You're Ready.`
**Supporting Text:** `Your Presence Plan has been saved. Good luck with your interview.`

**Statistics:** Presence Index, Journey Duration, Recommendations Applied, Confidence
**Achievement Card:** First Presence Journey, Professional Preparedness, AI Guidance Completed

**CTA:** Primary: `Return to Dashboard`, Secondary: `Start Another Journey`

**Motion:** Soft fade. Cards slide upward. Success icon scales gently.

---
# END OF FLOW 04
---

**DESIGN NOTE FOR STITCH:**
The **Presence Journey (Screens 18–36)** should feel like **one continuous guided conversation**, not nineteen disconnected pages.
Every transition should preserve context, maintain progress, and reduce cognitive load. Users should always know where they are, what has been completed, and what comes next.
This flow is the emotional and functional core of PersonaIQ. It should receive the highest level of visual polish, animation quality, and interaction refinement across the entire product.

---

# FLOW 05
# RESULTS & INSIGHTS

**Purpose:** The journey has ended, but the value continues. These screens help users understand, save, revisit, and act on the AI's recommendations.

## SCREEN 37
### Journey Summary

**Purpose:** Provide a complete overview of the finished journey before the user leaves.
**Layout:** Navigation ↓ Journey Header ↓ Presence Summary ↓ Winning Outfit ↓ Skin Summary ↓ Top Recommendations ↓ Preparation Checklist Status ↓ Export & Share ↓ Return to Dashboard

**Header:** `Software Engineering Interview`, `Tomorrow • 9:00 AM`, `Completed August 14, 2026`
**Presence Summary Card:** Large editorial card. Contains: Presence Index™, AI Confidence, Overall Readiness, Event Type, Journey Duration.
*Example:* `Presence Index™ 92 Excellent`, `AI Confidence 96%`, `Preparation Status Ready`
**Winning Outfit:** Large image. Below: `Business Formal`, `Recommended 96% Match`
**Preparation Snapshot:** Three columns (Appearance, Style, Event Match)
**Top Recommendations:** Only the highest impact recommendations. Maximum 5. Each recommendation includes Priority, Impact, Estimated effort, Status.
**CTA:** `Export Presence Plan`, `Save Journey`, `Return Home`

---

## SCREEN 38
### Detailed AI Explanation

**Purpose:** Increase trust through transparency. Users should understand **why** the AI made its recommendations.
**Layout:** Header ↓ Decision Timeline ↓ Reasoning Cards ↓ Confidence Breakdown ↓ Frequently Asked Questions

**Decision Timeline:** *Example:* ✓ Event Context ↓ ✓ Skin Analysis ↓ ✓ Outfit Comparison ↓ ✓ Dress Code Alignment ↓ ✓ Presence Modeling ↓ Final Recommendation
**Reasoning Cards:** Each recommendation has: Observation ↓ Interpretation ↓ Recommendation ↓ Expected Outcome
*Example:* Observation `Business formal dress code detected.` Interpretation `Structured tailoring is preferred.` Recommendation `Select Outfit 2.` Expected Outcome `Higher perceived professionalism.`
**Confidence Meter:** Use segmented bars instead of percentages alone.
**CTA:** `View Checklist`

---

## SCREEN 39
### Export Presence Plan

**Purpose:** Allow users to keep their plan outside the application.
**Layout:** Preview ↓ Export Formats ↓ Privacy Notice ↓ Export Button
**Export Options:** PDF, Image, Print, Save to Device
**Preview:** Miniature version of the Presence Plan.
**Privacy Notice:** Simple card. *Example:* `Your exported report contains only the information shown here. Images remain private.`
**CTA:** `Download Report`

---

## SCREEN 40
### Compare Previous Journeys

**Purpose:** Show growth over time.
**Layout:** Journey Selector ↓ Side-by-Side Comparison ↓ Trend Graph ↓ AI Insights
**Comparison Cards:** Interview A vs Interview B. Compare Presence Index, Style, Preparation, Lighting, Confidence.
**Trend Chart:** Minimal line graph. No excessive analytics.
**Insight Card:** *Example:* `Your professional presence has improved by 11 points over your last four journeys.`
**CTA:** `Start New Journey`

---

## SCREEN 41
### Share Success (Optional)

**Purpose:** Encourage sharing without making it feel promotional.
**Layout:** Simple centered page. Illustration. Achievement.
*Example:* `You're Ready. Best of luck with your interview.`
**Buttons:** Save Image, Copy Summary, Start New Journey
No forced social sharing. No gamification.

---
# END FLOW 05
---

# FLOW 06
# HISTORY

History should feel like a personal archive—not a database.

## SCREEN 42
### Journey Archive

**Purpose:** Store every completed journey.
**Layout:** Search ↓ Filters ↓ Timeline ↓ Journey Cards
**Filters:** All, Interview, Presentation, Networking, Wedding, Business, Completed, Draft
**Each Card Contains:** Event, Date, Presence Index, Winning Outfit, Status. Clicking opens Journey Details.

---

## SCREEN 43
### Journey Details

**Purpose:** Revisit any previous Presence Plan.
**Layout:** Journey Header ↓ Summary ↓ Recommendations ↓ Checklist ↓ AI Explanation ↓ Export Again
**Hero:** Large winning outfit.
**Summary:** Presence Index, Event, Date, Confidence
**Recommendations:** Exactly as originally generated. Immutable.
**CTA:** `Duplicate Journey`

---

## SCREEN 44
### Personal Progress

**Purpose:** Show long-term improvement.
**Layout:** Statistics ↓ Trend Graphs ↓ Achievements ↓ Insights
**Metrics:** Average Presence Index, Most Successful Outfit Style, Average Confidence, Journeys Completed, Preparation Consistency
**Insights:** *Example:* `Business Casual consistently performs well across networking events.`
**CTA:** `Start Another Journey`

---
# END FLOW 06
---

# FLOW 07
# SETTINGS

Settings should feel clean, quiet, and secondary. This is not a feature showcase.

## SCREEN 45
### Settings Home
**Sections:** Profile, Appearance, Notifications, Privacy, Connected Accounts, Help, About, Danger Zone

## SCREEN 46
### Profile
**Editable:** Photo, Name, Email, Occupation, Preferred Style, Default Event Type
**Statistics:** Journeys, Average Score, Member Since

## SCREEN 47
### Appearance
**Options:** Light, Dark, System
Typography Preview, Spacing Preview, Accessibility Preview

## SCREEN 48
### Privacy
**Purpose:** Build trust.
**Options:** Delete Uploaded Images Automatically, Analytics, Data Export, Delete Account, Privacy Policy
Each option clearly explains its impact.

## SCREEN 49
### Notifications
Email, Push, Journey Reminders, Upcoming Events, Preparation Alerts, Weekly Insights
Each toggle includes a one-line description.

## SCREEN 50
### Connected Accounts
Google, GitHub, Apple (Future), Microsoft (Future)
**Status:** Connected / Not Connected. **Buttons:** Connect, Disconnect

---
# END FLOW 07
---

# FLOW 08
# SYSTEM STATES

Every production-ready application needs polished system experiences.

**SCREEN 51:** 404 — Page Not Found
**SCREEN 52:** 500 — Something Went Wrong
**SCREEN 53:** Offline Mode
**SCREEN 54:** No Internet Connection
**SCREEN 55:** Maintenance
**SCREEN 56:** Empty Dashboard (Illustration, CTA: Start First Journey)
**SCREEN 57:** No Journey History (Illustration, Button: Create Your First Journey)
**SCREEN 58:** Processing Error (Explain the issue clearly. Offer Retry. Never blame the user.)
**SCREEN 59:** Image Upload Failed (Provide guidance. Support drag-and-drop retry.)
**SCREEN 60:** Camera Permission Required (Explain why access is needed. Offer: Grant Permission, Upload Instead)
**SCREEN 61:** Session Expired (Simple re-authentication.)
**SCREEN 62:** Unsupported Browser (Recommend supported browsers.)
**SCREEN 63:** Feature Coming Soon (Minimal placeholder. Collect interest where appropriate.)
**SCREEN 64:** Account Deleted Confirmation (Simple confirmation with support contact.)
**SCREEN 65:** Global Loading Experience
This is the universal loading state used across the product.
It should include: PersonaIQ logo, Animated progress indicator, Context-aware loading message (e.g., "Preparing your Presence Plan…"), Soft background animation, No percentage unless a deterministic process is available.

---

**FINAL STITCH INSTRUCTION**
When generating PersonaIQ:
* Treat all 65 screens as a single, cohesive product.
* Reuse components aggressively to maintain consistency.
* Preserve the same typography, spacing, card styles, button hierarchy, iconography, border radius, and motion language across every flow.
* Prioritize generous whitespace, editorial layouts, and a premium, understated visual aesthetic inspired by Linear, Stripe, OpenAI, Apple, and MIT's restrained visual identity.
* The user should never feel they are moving between separate pages—they should feel they are progressing through one intelligent, continuous experience that helps them build confidence for an important moment.
