---
name: Academic Precision
colors:
  surface: '#fff8f7'
  surface-dim: '#ecd5d3'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#ffe9e7'
  surface-container-high: '#fbe3e1'
  surface-container-highest: '#f5dddb'
  on-surface: '#251818'
  on-surface-variant: '#584140'
  inverse-surface: '#3b2d2c'
  inverse-on-surface: '#ffedeb'
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
  tertiary: '#002242'
  on-tertiary: '#ffffff'
  tertiary-container: '#003866'
  on-tertiary-container: '#7ba2d7'
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
  tertiary-fixed: '#d3e4ff'
  tertiary-fixed-dim: '#a2c9ff'
  on-tertiary-fixed: '#001c38'
  on-tertiary-fixed-variant: '#1b4877'
  background: '#fff8f7'
  on-background: '#251818'
  surface-variant: '#f5dddb'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 600px
  edge-margin: 24px
  stack-lg: 32px
  stack-md: 16px
  stack-sm: 8px
  gutter: 12px
---

## Brand & Style
The design system for PersonaIQ emails is rooted in **Academic Precision**—a style that balances the rigorous heritage of institutions like MIT with the streamlined efficiency of a high-growth technology startup. The aesthetic is clean, professional, and authoritative, designed to foster trust and clarity in every communication.

The visual narrative employs a **Corporate / Modern** approach with a focus on structured information density. It avoids unnecessary ornamentation, relying instead on deliberate white space, high-contrast typography, and a "paper-and-ink" digital philosophy that ensures content is legible across all email clients and devices.

## Colors
The palette is anchored by **MIT Deep Red**, used purposefully for primary branding and key action triggers. **Charcoal** is utilized for body text to reduce eye strain compared to pure black, while maintaining high contrast against the **Soft Off-White** background.

- **Primary:** MIT Deep Red (#750013) – Reserved for headers, primary CTAs, and brand identifiers.
- **Secondary:** MIT Warm Gray (#8B959E) – Used for metadata, borders, and secondary text.
- **Background:** Soft Off-White (#F9F9F9) – Provides a clean, modern canvas that feels more sophisticated than pure white.
- **Critical Alert:** Vibrant Red (#FF1323) – Exclusively for system failures, billing issues, or high-priority warnings.

## Typography
This design system utilizes **Geist Sans** to reflect a technical, developer-friendly precision. For maximum compatibility in email environments, always include a stack of system sans-serif fonts (Helvetica, Arial, sans-serif) as fallbacks.

Headlines should be bold and tightly tracked to command attention, while body copy maintains a generous line height (1.5x) to ensure readability in long-form correspondence. Small labels used in footers or tables should be rendered in uppercase with slight tracking to maintain distinctness at small scales.

## Layout & Spacing
The layout follows a **Fixed Grid** model optimized for email clients, centered with a maximum width of 600px. 

- **Vertical Rhythm:** Use a 8px base grid. Sections are separated by 32px (stack-lg), while related content blocks use 16px (stack-md).
- **Safe Zones:** Maintain a 24px horizontal margin across all devices to prevent content from touching the edges of the screen on mobile.
- **Reflow:** Multi-column layouts (such as 2-column feature grids) must stack vertically on screens smaller than 480px.

## Elevation & Depth
In line with the Academic Precision narrative, depth is conveyed through **Tonal Layers** rather than heavy shadows. 

- **Level 0 (Base):** Soft Off-White (#F9F9F9) for the email background.
- **Level 1 (Cards):** Pure White (#FFFFFF) surfaces used for content blocks, featuring a subtle 1px border in MIT Warm Gray (#8B959E) at 20% opacity.
- **Focus:** No shadows are used for standard elements. A very soft, diffused shadow (10% opacity, 4px blur) may be applied only to the primary CTA button to provide a tactile affordance.

## Shapes
The shape language is **Soft (0.25rem)**. This subtle rounding maintains a professional, institutional feel while acknowledging modern UI conventions. 

- **Buttons:** 4px border radius.
- **Cards/Containers:** 8px (rounded-lg) for main content blocks to create a distinct containerized feel.
- **Input fields (for interactive forms):** 4px border radius.

## Components
### Header
Minimalist execution. The PersonaIQ logo {{DATA:IMAGE:IMAGE_6}} is left-aligned or centered, with a maximum height of 32px. No navigation links in the header to ensure focus remains on the message.

### Hero Section
Features `headline-lg` text. Background is typically the base off-white, but can occasionally use a Deep Red tint for high-impact announcements.

### CTAs
Primary buttons use MIT Deep Red background with White text. They are full-width on mobile and ghosted or intrinsic width on desktop. Secondary CTAs use a 1px Charcoal border with no fill.

### Content Blocks
Use white cards or clean white space separated by `stack-lg`. For informational lists, use a subtle 1px horizontal separator in Warm Gray.

### Tables (Invoices/Receipts)
Professional, data-heavy layout. Headers use `label-caps` with a light gray background tint. Rows are separated by thin lines. Numeric data is right-aligned to Geist's tabular lining properties.

### Alert States
Critical notifications use a `2px` left-border accent in Vibrant Red (#FF1323) with a pale pink background tint to distinguish them from standard informational content.

### Footer
Tertiary information in `body-sm`. Social icons should be monochrome (Warm Gray). Links for 'Unsubscribe' and 'Support' must be underlined for accessibility and legal compliance.