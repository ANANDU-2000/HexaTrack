---
name: HexaTrack
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393d'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1c1b1f'
  surface-container: '#201f23'
  surface-container-high: '#2a292d'
  surface-container-highest: '#353438'
  on-surface: '#e5e1e6'
  on-surface-variant: '#c8c5d0'
  inverse-surface: '#e5e1e6'
  inverse-on-surface: '#313034'
  outline: '#918f9a'
  outline-variant: '#46464f'
  surface-tint: '#c1c1fc'
  primary: '#c1c1fc'
  on-primary: '#2a2b5b'
  primary-container: '#1a1b4b'
  on-primary-container: '#8384ba'
  inverse-primary: '#585a8d'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#4b8eff'
  on-secondary-container: '#00285c'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#09007c'
  on-tertiary-container: '#7679ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1fc'
  on-primary-fixed: '#141545'
  on-primary-fixed-variant: '#404273'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#131316'
  on-background: '#e5e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is engineered to project a sense of "Intelligent Wealth." It blends the precision of modern engineering tools with the high-end sophistication of premium fintech. The brand personality is calculated, fast, and secure.

The visual direction follows a **Modern Glassmorphic** aesthetic. It utilizes semi-transparent surfaces, ultra-fine borders, and subtle background blurs to create a sense of depth and lightness. This is complemented by high-performance layout principles—maximizing whitespace to allow data to breathe while using sharp, vibrant accents to guide the user's eye toward actionable financial insights.

## Colors
The palette is built on a foundation of **Deep Indigo**, providing a more sophisticated and stable alternative to pure black or generic navy. 

- **Primary (Deep Indigo):** Used for deep backgrounds and structural grounding.
- **Action (Electric Blue):** Reserved for primary interactions, buttons, and "active" states.
- **Success (Emerald Green):** Indicates positive growth, profit, and completed transactions.
- **Accents (Soft Purple):** Used sparingly for AI-driven insights and premium feature highlights.
- **Surface Neutrals:** In dark mode, surfaces use varying opacities of slate and indigo to maintain depth. In light mode, surfaces are stark white with soft grey borders to ensure high contrast.

## Typography
This design system uses **Hanken Grotesk** as its primary typeface to achieve a clean, sharp, and contemporary feel that scales perfectly from dense data grids to large marketing headlines. 

**JetBrains Mono** is introduced as a secondary label font for financial figures, transaction IDs, and technical metadata, reinforcing the "precision tool" aesthetic. 

Maintain a high contrast ratio (at least 7:1 for body text). Use "Display-LG" for hero numbers (e.g., Net Worth) and "Label-Mono" for secondary data points to create a clear information hierarchy.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Dashboards utilize a 12-column grid with a maximum content width of 1440px, centered on the viewport. 

- **Desktop:** 12 columns / 24px gutter / 40px margins.
- **Tablet:** 8 columns / 16px gutter / 24px margins.
- **Mobile:** 4 columns / 16px gutter / 16px margins.

Spacing is based on a 4px baseline grid. Large containers (Cards) should always use `md` (24px) or `lg` (48px) padding to maintain a premium, spacious feel. Dense data tables may drop to `xs` (8px) internal padding for maximum information density.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional drop shadows. This approach keeps the UI feeling fast and digital.

- **Level 0 (Base):** The main background color.
- **Level 1 (Surface):** 40% opacity tint of the primary color with a 12px backdrop blur. Used for sidebar and navigation.
- **Level 2 (Cards):** 60% opacity with 20px backdrop blur and a 1px inner border (white at 10% opacity) to catch the light.
- **Level 3 (Modals):** 80% opacity with 40px backdrop blur and a soft, diffused ambient shadow (Deep Indigo, 20% opacity, 40px blur).

Transitions between levels should be handled with smooth, 200ms linear-out-slow-in animations.

## Shapes
The design system utilizes a **Rounded** shape language to soften the serious nature of finance and make the platform feel more accessible and "intelligent."

- **Large Containers/Cards:** Use `rounded-xl` (24px) to create the signature premium look.
- **Buttons/Inputs:** Use `rounded-lg` (16px) for a balanced tactile feel.
- **Chips/Badges:** Use "Pill-shaped" (Full radius) to distinguish them from actionable buttons.

All glassmorphic panels must have matching corner radii to their container to maintain visual harmony.

## Components

### Smart Cards
The centerpiece of the UI. Cards feature a subtle gradient highlight in the top-left corner (Electric Blue at 5% opacity). They should have a 1px border with a "linear-gradient" effect to simulate light hitting the edge.

### Glass Navigation
The sidebar or top-nav is semi-transparent with a heavy backdrop blur. Active states are indicated by a 2px vertical "Electric Blue" bar and a slight increase in surface opacity.

### Animated Charts
Charts use "Emerald Green" for growth and "Electric Blue" for general data. Lines should be 2px thick with a soft glow effect (drop-shadow using the line color at 30% opacity).

### Inputs & Fields
Fields use a dark-tinted background (5% opacity) with a 1px bottom border that glows "Electric Blue" upon focus. Typography inside inputs uses the "Label-Mono" style for numerical entry.

### Buttons
- **Primary:** Solid "Electric Blue" with white text. No shadow, but a slight scale-down (0.98x) on click.
- **Secondary:** Glassmorphic background with white text and a 1px border.
- **Tertiary:** Ghost style, text-only with a subtle background hover state.

### Modern Fintech Icons
Use line-based icons (2px stroke) with rounded terminals to match the typography. Avoid solid fills unless used as a notification indicator.