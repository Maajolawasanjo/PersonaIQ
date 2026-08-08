---
name: Academic Precision
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#584140'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#8c716f'
  outline-variant: '#e0bfbd'
  surface-tint: '#ad3035'
  primary: '#4d0009'
  on-primary: '#ffffff'
  primary-container: '#750013'
  on-primary-container: '#ff7574'
  inverse-primary: '#ffb3b0'
  secondary: '#566068'
  on-secondary: '#ffffff'
  secondary-container: '#d7e1eb'
  on-secondary-container: '#5a646c'
  tertiary: '#222222'
  on-tertiary: '#ffffff'
  tertiary-container: '#373737'
  on-tertiary-container: '#a1a0a0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#8c1621'
  secondary-fixed: '#dae4ed'
  secondary-fixed-dim: '#bec8d1'
  on-secondary-fixed: '#131d24'
  on-secondary-fixed-variant: '#3e4850'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  mit-red-vibrant: '#FF1323'
  charcoal: '#333333'
  border-subtle: '#E5E7EB'
typography:
  display-lg:
    fontFamily: Geist Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  metric-display:
    fontFamily: Geist Mono
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system for PersonaIQ is anchored in a philosophy of **Academic Editorialism**. It translates the authoritative and intellectual heritage of MIT into a modern, high-tech interface that feels calm, intelligent, and profoundly trustworthy. 

The aesthetic is a hybrid of **Minimalism** and **Corporate Modernism**, drawing inspiration from the functional clarity of Apple and the technical precision of Vercel. It prioritizes "calm before complexity," utilizing generous whitespace and a restricted color palette to guide the user through the Presence Journey. The visual narrative is one of progressive disclosure—reducing cognitive load by presenting only what is necessary, while using sophisticated AI-specific components to demystify complex data into actionable insights.

## Colors

The palette is intentionally restrained to evoke an editorial feel. **MIT Deep Red** serves as the primary brand anchor, used exclusively for high-impact actions and brand signifiers to maintain its psychological weight. 

- **Primary:** MIT Deep Red (#750013) for primary buttons and critical status.
- **Secondary:** MIT Warm Gray (#8B959E) for supporting UI elements and secondary navigation.
- **Tertiary:** Charcoal (#333333) for primary typography to ensure high legibility and a softer contrast than pure black.
- **Neutral:** Soft Off-White (#FBFBFB) for page backgrounds, providing a premium, paper-like canvas.

The **Vibrant Red** (#FF1323) is reserved for interactive accents or highlighting exceptional AI insights within the Presence Index™.

## Typography

The system uses **Geist Sans** as the primary driver for narrative and headings, chosen for its Swiss-inspired neutrality and technical sophistication. **Geist Mono** is utilized as a secondary functional typeface for technical values, metrics, and AI-generated metadata, reinforcing the "IQ" aspect of the product.

- **Display & Headings:** Use tight letter spacing and heavy weights (700) to create a strong visual hierarchy.
- **Body Text:** Maintained at 1.6x line height for maximum readability in editorial sections.
- **Technical Labels:** All caps with increased letter spacing are preferred for Mono labels to distinguish them from standard body text.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is centered on "The Focused Column"—limiting the width of reading areas to 720px even on wide displays to maintain an editorial feel.

- **Vertical Rhythm:** Built on an 8px baseline grid.
- **Margins:** Generous outer margins (48px+) on desktop to create a "gallery" effect for cards.
- **Breakpoints:** 
    - Mobile: Up to 639px (Single column, bottom nav).
    - Tablet: 640px–1023px (Adaptive grid, collapsible sidebar).
    - Desktop: 1024px+ (Multi-column, fixed sidebar).

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Surfaces do not "float" high above the background; instead, they sit just above it, creating a tactile but grounded feel.

- **Surfaces:** The base layer is Soft Off-White. Cards use a pure white surface to pop against the base.
- **Shadows:** Use extra-diffused, low-opacity shadows (e.g., `0 4px 24px rgba(0,0,0,0.04)`). Avoid heavy blacks; shadows should feel like a soft glow of depth.
- **Interactive Depth:** On hover, cards should subtly lift (increase shadow spread and move -2px Y) to signal interactivity without breaking the calm atmosphere.

## Shapes

The shape language balances modern software aesthetics with approachable curves. While the core "Rounded" setting applies to most UI elements, the system uses a tiered radius system to indicate containment:

- **Small (8px):** Input fields, small buttons, and tags.
- **Medium (12px):** Standard cards and secondary action containers.
- **Large (20px):** Primary dashboard cards and Presence DNA™ containers.
- **Extra Large (28px):** Hero sections and main journey containers.

## Components

### Buttons
- **Primary:** Solid MIT Deep Red with white Geist Sans text. 12px radius.
- **Secondary:** Ghost style with Charcoal text and a 1px border of Warm Gray.
- **States:** Hover triggers a subtle 1.02x scale and a slight darkening of the background color.

### AI Components
- **Presence Index™:** A radial gauge (Presence Gauge) using the Geist Mono font for the score. The gauge should utilize a gradient of MIT Red to MIT Gray to indicate "readiness."
- **Explainability Panels:** Use a Geist Mono label "ANALYSIS" at the top-left in all-caps, with a light gray background and a subtle border to distinguish from user-inputted content.

### Cards
- **Modern Cards:** 20px corner radius, white background, soft ambient shadow. No borders, unless placed on a white background, in which case use a 1px `border-subtle`.

### Inputs & Fields
- **Input Fields:** 8px radius, subtle gray border, focused state uses a 2px MIT Red ring with high transparency.

### Iconography
- **Style:** Lucide icons in "Outline" mode. 1.5px or 2px stroke weight to match the Geist Sans weight. Icons should always be monochrome (Charcoal or Gray) unless used as a status indicator.