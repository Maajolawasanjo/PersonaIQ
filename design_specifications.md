# PersonaIQ Design Specifications

---

# 1. Information Architecture
**Document ID:** PIQ-DESIGN-001  
**Version:** 1.0  
**Status:** Approved  
**Owner:** Product Design  

---

# Design Philosophy

PersonaIQ is not a dashboard.
It is a guided experience.
Every screen should reduce uncertainty and help users prepare for an important moment with confidence.

**Design Principles**
• Calm before complexity
• Progressive disclosure
• One primary action per screen
• Explain every AI decision
• Minimize cognitive load
• Mobile-first
• Accessibility by default

---

# Primary Navigation

Landing
↓
Authentication
↓
Dashboard
↓
Presence Journey
↓
Best Presence Plan
↓
History
↓
Settings

---

# Sitemap

**Home**
├── Features
├── How It Works
├── Pricing (Future)
├── Documentation
└── Sign In

**Dashboard**
├── Start Presence Journey
├── Journey History
├── PresenceDNA™
├── Saved Presence Plans
└── Profile

**Presence Journey**
├── Event Context
├── Upload Selfie
├── Upload Outfits
├── Processing
└── Results

**Results**
├── Presence Index™
├── Presence Boosts™
├── Best Presence Plan™
├── Checklist
└── Save Journey

**Settings**
├── Profile
├── Connected Accounts
├── Notifications
├── Privacy
└── Appearance

---

# User Flow

Landing
↓
Sign In
↓
Dashboard
↓
Create Journey
↓
Event Details
↓
Upload Selfie
↓
Upload Outfit(s)
↓
AI Analysis
↓
Best Presence Plan
↓
Save Journey
↓
Dashboard

---

# Navigation Rules

**Desktop**
Top Navigation + Left Sidebar

**Tablet**
Collapsible Sidebar

**Mobile**
Bottom Navigation + Context Header

---

# Global Elements

Navigation Bar
Progress Indicator
Breadcrumbs (Desktop)
Toast Notifications
Modal Dialogs
Loading Overlay
Empty States
Error States
Success States
Command Palette (Future)

---

# Content Hierarchy

**Level 1**
Page Title

**Level 2**
Primary Insight

**Level 3**
Recommendations

**Level 4**
Supporting Details

*The user's attention should always be drawn to the next recommended action.*

---

# 2. Component Library
**Document ID:** PIQ-DESIGN-002

---

# Design Philosophy

Components should be composable, accessible, reusable, and visually consistent.

Every component must support:
• Light Theme
• Dark Theme
• Keyboard Navigation
• Responsive Layout
• Loading State
• Disabled State
• Error State

---

# Foundations

Button
Input
Textarea
Select
Checkbox
Radio Group
Switch
Slider
Avatar
Badge
Tooltip
Popover
Dialog
Drawer
Tabs
Accordion
Toast
Progress
Skeleton
Separator

---

# Layout Components

Navbar
Sidebar
Bottom Navigation
Container
Section
Card
Grid
Stack
Split View
Hero
Footer

---

# AI Components

Presence Index™
Presence Gauge
Confidence Indicator
Recommendation Card
Presence Boost™
Checklist
Journey Timeline
Processing Stepper
Analysis Summary
Explainability Panel

---

# Media Components

Image Upload
Drag & Drop Zone
Image Preview
Before / After
Outfit Comparison
Virtual Try-On Viewer

---

# Dashboard Components

Journey Card
Recent Activity
Quick Actions
Analytics Card
Metric Card
History Timeline

---

# Status Components

Loading Screen
Empty State
Success Screen
Error Screen
Retry Panel
Offline Notice

---

# Accessibility

Minimum touch target: 44px
Keyboard accessible
Screen reader labels
Visible focus states
Color contrast compliant

---

# 3. Design Tokens
**Document ID:** PIQ-DESIGN-003

---

# Typography

**Primary Font**
Geist Sans

**Secondary Font**
Geist Mono

**Heading Weight**
700

**Body Weight**
400

**Medium**
500

**Semibold**
600

---

# Color Philosophy

Inspired by the MIT visual identity.
Dominant colors:

**MIT Deep Red**
Primary Brand

**MIT Warm Gray**
Supporting UI

**Soft Off-White**
Background

**Charcoal**
Primary Text

Accent colors should be used sparingly.
Red communicates focus, not decoration.

---

# Spacing Scale

4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96

---

# Border Radius

**Small**
8px

**Medium**
12px

**Large**
20px

**Extra Large**
28px

**Pill**
999px

---

# Shadows

Soft
Medium
Large

Use shadows only to establish hierarchy.
Avoid heavy elevation.

---

# Border System

1px
Neutral Gray
Subtle Dividers

No decorative borders.

---

# Icons

Lucide Icons
24px default
20px compact
32px hero

---

# Illustrations

Minimal
Editorial
Modern

Never cartoonish.

---

# Imagery

Real people.
Natural lighting.
Authentic expressions.
Diverse representation.

---

# Grid

12-column desktop
8-column tablet
4-column mobile
8px baseline grid

---

# 4. Motion System
**Document ID:** PIQ-DESIGN-004

---

# Philosophy

Motion should communicate state, not decoration.
Every animation must answer one question: "What changed?"

---

# Motion Principles

Fast
Purposeful
Subtle
Accessible
Predictable

---

# Durations

**Instant**
100ms

**Fast**
200ms

**Standard**
300ms

**Complex**
500ms

---

# Easing

**Ease Out**
Default

**Ease In Out**
Transitions

**Spring**
Micro-interactions

---

# Motion Types

Fade
Slide
Scale
Progress
Morph
Count Up
Shimmer

---

# Screen Transitions

Page Fade
Section Slide
Dialog Scale
Drawer Slide
Toast Fade

---

# AI Processing

Animated Workflow
Progress Timeline
Pulse Indicators
Skeleton Loading
Progressive Result Reveal

---

# Hover

**Cards**
Lift 2px

**Buttons**
Scale 1.02

**Inputs**
Border Highlight

---

# Accessibility

Respect prefers-reduced-motion.
Disable non-essential animations.

---

# 5. Responsive Strategy
**Document ID:** PIQ-DESIGN-005

---

# Philosophy

Design mobile first.
Enhance for larger screens.
Never remove functionality on smaller devices.

---

# Breakpoints

**Mobile**
0–639px

**Tablet**
640–1023px

**Desktop**
1024–1439px

**Wide**
1440px+

---

# Layout Rules

**Desktop**
Multi-column layouts
Sidebar navigation
Expanded analytics

**Tablet**
Adaptive grid
Collapsible sidebar
Touch-first spacing

**Mobile**
Single column
Bottom navigation
Large tap targets
Reduced visual density

---

# Images

Responsive
Optimized
Lazy loaded
Modern formats

---

# Typography

Fluid scaling
Readable line lengths
Maximum content width

---

# Touch Targets

Minimum 44×44px
Adequate spacing
Thumb-friendly placement

---

# Performance

Prioritize above-the-fold content
Code splitting
Image optimization
Deferred animations

---

# Testing Matrix

Chrome, Safari, Firefox, Edge, Android, iOS, Tablet, Desktop, Large Display

---

# Success Criteria

No horizontal scrolling
No clipped content
No layout shifts
Consistent interaction patterns
Accessible across all supported devices
