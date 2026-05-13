---
name: HexaTrack Premium Fintech
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display-balance:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 20px
  gutter: 16px
  card-padding: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system embodies a "Futuristic Precision" aesthetic, targeting high-net-worth users who value clarity, speed, and sophisticated financial management. The brand personality is clinical yet visionary—combining the reliability of traditional banking with the cutting-edge feel of a digital asset command center.

The primary style is **Glassmorphism**, utilized not as a decorative gimmick but as a functional layering system. By using varying levels of translucency and backdrop blurs, the interface creates a sense of physical depth and data hierarchy. The visual language is inspired by aerospace cockpits and high-end hardware interfaces, emphasizing dark-mode optimization to ensure that neon accent colors and data visualizations command the user's focus.

## Colors
The palette is built on a "Deep Space" foundation. The **Primary Background** (#0B1020) provides an infinite depth, while the **Secondary Background** (#111827) defines structural areas like header bars or modular sections.

Accent colors are used with extreme intent:
- **Emerald** is reserved for positive financial growth, "Success" states, and active balances.
- **Cyan** represents technology, connectivity, and futuristic interactions.
- **Indigo** is the "Focus" color, used for primary calls to action and active navigation states.

All card elements utilize a translucent glass effect with a 1px border of `rgba(255, 255, 255, 0.1)` to define edges against the dark backdrop without adding visual bulk.

## Typography
The typography system prioritizes high-readability and a technical edge. **Hanken Grotesk** serves as the primary typeface, offering a clean, contemporary feel that scales perfectly from large balance displays to dense transactional data.

A specialized **display-balance** style is defined for the primary wallet screen to create immediate visual impact. For technical details, metadata, and labels, **Geist** is introduced to provide a monospaced, developer-centric aesthetic that reinforces the "futuristic" brand narrative. All headers should favor tight letter-spacing to maintain a "locked-in" professional look.

## Layout & Spacing
This design system utilizes a **Fluid Grid** for mobile devices, anchored by a 20px outer margin. All spacing is based on a 4px base unit to ensure perfect mathematical alignment.

Vertical rhythm is maintained through "Stacks":
- **Stack-SM (8px):** For related items like a label and its input field.
- **Stack-MD (16px):** For spacing between items in a list or consecutive paragraphs.
- **Stack-LG (32px):** For separating distinct content blocks or sections.

Interactive elements (buttons, inputs) must maintain a minimum height of 56px to ensure accessibility and a premium, "heavy" feel.

## Elevation & Depth
Depth is created through the interplay of light and transparency rather than traditional heavy drop shadows.

1.  **Level 0 (Base):** Primary Background (#0B1020).
2.  **Level 1 (Panels):** Secondary Background (#111827) with no blur, used for grouping content.
3.  **Level 2 (Glass Cards):** `rgba(255, 255, 255, 0.06)` with a **20px Backdrop Blur**. These cards should feature a very soft, 24px spread "Ambient Shadow" with 40% opacity of the primary background color.
4.  **Level 3 (Floating Elements):** High-translucency pills (e.g., Navigation) with a 40px blur and a subtle 1px "inner glow" highlight on the top edge to simulate glass catching light.

## Shapes
The shape language is dominated by **extremely rounded corners**, conveying a sense of organic smoothness within a digital framework. 

- **Primary Cards:** A consistent 28px radius creates the "Apple Wallet" signature aesthetic.
- **Navigation/CTAs:** Full pill-shapes (rounded-full) are used for the floating navigation bar and primary action buttons to differentiate them from static content containers.
- **Form Inputs:** Slightly sharper 16px radius to provide a more structured, functional feel for data entry.

## Components
- **Primary Buttons:** High-contrast Indigo (#6366F1) background with white text, 56px height, and pill-shaped radius. On tap, include a subtle scale-down (0.98x) interaction.
- **Glass Cards:** Use the `card_surface` variable with 28px corners. Include a 1px border. Inside, use `label-caps` for headers and `display-balance` for primary figures.
- **Floating Pill Navigation:** A centered, bottom-aligned glass bar. Icons should be monochrome (White/Secondary Text) with the active state indicated by a Cyan (#06B6D4) glow or underline.
- **Input Fields:** Matte panels using the Secondary Background (#111827) with a 1px border that glows Cyan when focused.
- **Chips/Badges:** Small glass pills with tinted text (e.g., Emerald text on a 10% Emerald background) for status indicators like "Completed" or "Trading."
- **List Items:** Separated by a 1px `rgba(255, 255, 255, 0.05)` divider. Use Chevron-right icons in `text_secondary` to indicate drill-down capability.