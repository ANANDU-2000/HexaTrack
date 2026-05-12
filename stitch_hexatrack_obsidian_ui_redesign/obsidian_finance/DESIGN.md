---
name: Obsidian Finance
colors:
  surface: '#11131a'
  surface-dim: '#11131a'
  surface-bright: '#373941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b22'
  surface-container: '#1d1f27'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424753'
  surface-tint: '#afc6ff'
  primary: '#afc6ff'
  on-primary: '#002d6c'
  primary-container: '#528dff'
  on-primary-container: '#00275f'
  inverse-primary: '#0059c6'
  secondary: '#c1c1fc'
  on-secondary: '#2a2b5c'
  secondary-container: '#434476'
  on-secondary-container: '#b3b3ed'
  tertiary: '#ffb77b'
  on-tertiary: '#4d2700'
  tertiary-container: '#d87802'
  on-tertiary-container: '#432100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#afc6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004398'
  secondary-fixed: '#e1dfff'
  secondary-fixed-dim: '#c1c1fc'
  on-secondary-fixed: '#151546'
  on-secondary-fixed-variant: '#414274'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77b'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#11131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-amount:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  amount-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-main: 20px
  gutter-bento: 12px
  stack-gap: 16px
  section-padding: 24px
---

## Brand & Style
The design system for this premium finance app is built upon the concept of "Obsidian Finance"—a visual metaphor for depth, precision, and luxury. The brand personality is authoritative yet ethereal, blending the structural rigidity of bento-style layouts with the fluid, organic feel of liquid glass. 

The emotional response is one of "Atmospheric Control." By utilizing deep OLED blacks and subtle radial glows, the UI recedes to make financial data feel like it is floating in a high-tech void. It prioritizes high-end aesthetics for a sophisticated user base, emphasizing clarity through contrast and depth through layered translucency.

## Colors
The palette is engineered for OLED efficiency and high-fidelity depth. 

- **Foundation:** The `#0b0d11` base ensures perfect blacks, allowing the `#111827` surface cards to appear subtly elevated. 
- **Accents:** Primary Blue is used for tactical actions, while Lavender Violet serves as a secondary accent for highlighting premium features or insights.
- **Sentiment:** Financial health is communicated through high-saturation Green and Red, optimized for legibility against dark backgrounds.
- **Atmosphere:** Glow tokens should be used sparingly as background radial gradients behind key cards to simulate ambient light leakage.

## Typography
The typography system utilizes **Manrope** for its modern, geometric balance and exceptional legibility in financial contexts. 

- **Numerical Hierarchy:** Financial amounts are treated as "Display" elements, using ExtraBold or Heavy weights to ensure they are the first thing a user sees.
- **Clarity:** **Hanken Grotesk** is introduced for secondary labels and data captions to provide a slight technical contrast to the primary brand font.
- **Scaling:** On mobile, avoid font sizes below 12px. Use `label-caps` for table headers and metadata to maintain a structured, professional appearance.

## Layout & Spacing
This system employs a **Bento Grid** philosophy tailored for mobile. The layout is fluid, adapting to screen width while maintaining consistent 20px outer margins.

- **Bento Logic:** Content is organized into modular tiles. These tiles should use a 2-column grid system where items can span 1 or 2 columns.
- **Rhythm:** Use a strict 4px/8px baseline shift. Most vertical stacks should utilize 16px (`stack-gap`) to maintain breathing room between cards.
- **The Bottom Stack:** The navigation area is reserved as a fixed safe zone at the bottom of the viewport, ensuring the floating action button (FAB) remains accessible regardless of scroll depth.

## Elevation & Depth
Elevation is not achieved through drop shadows, but through **Tonal Layering** and **Backdrop Blurring**.

1.  **Level 0 (Background):** `#0b0d11`. Pure black void.
2.  **Level 1 (Bento Cards):** `#111827` with a `Border Subtile`.
3.  **Level 2 (Liquid Glass):** Use `background-blur: 20px` and 60% opacity on `#0f1623` for elements like the Bottom Nav or Modal Sheets. This creates a "Liquid Glass" effect where content behind is softened but visible.
4.  **Ambient Depth:** Apply `Glow Blue` or `Glow Violet` as a radial gradient (80px radius) behind the most important financial stat to "lift" it off the screen.

## Shapes
The shape language is "Hyper-Rounded," reflecting a premium, modern aesthetic that feels comfortable and organic.

- **Hero Sections:** Large top-level containers or header areas use a 28px radius.
- **Bento Cards:** Standard cards use 20px. When cards are nested, the inner radius should be reduced to 12px to maintain visual harmony.
- **Interactions:** Buttons and input fields use a slightly tighter 14px radius to distinguish them from structural containers.

## Components
- **Bento Stats:** Cards featuring `amount-md` text, a `label-caps` header, and a subtle sparkline icon. Backgrounds should be `#111827`.
- **Liquid Bottom Nav:** A fixed bar with `backdrop-filter: blur(24px)` and a `Border Mid` top stroke. The FAB is a perfect circle, colored in `Accent Blue` with a subtle `Glow Blue` shadow.
- **Glass Inputs:** Fields use `#0f1623` with a 1px `Border Mid` that glows `Accent Blue` on focus.
- **Action Buttons:**
    - *Primary:* Solid `Accent Blue` with white text.
    - *Secondary:* Ghost style with `Border Mid` and `Text Primary`.
- **List Items:** High-density rows with 60px height, using `Secondary Text` for descriptions and `Income/Expense` colors for the trailing amounts.