# UI system lock (auth + admin surfaces)

This document **locks interaction and layout rules** for **new** authentication and super-admin UI so outputs stay aligned with HexaTrack’s premium dark system. Finance screens already in the app may migrate incrementally.

## Canonical tokens

All **new** auth/admin surfaces must use [DESIGN_TOKENS.md](DESIGN_TOKENS.md):

| Role | Token | Hex |
|------|--------|-----|
| Page background | `background` | `#0B1015` |
| Cards / panels | `surface` | `#121A22` |
| Primary CTA | `primary` | `#4F8CFF` |
| Borders | `border` | `rgba(255,255,255,0.06)` |
| Primary text | `textPrimary` | `#F5F7FA` |
| Muted text | `textMuted` | `#8B9BB4` |

**Auth card surface:** Use **`surface` (`#121A22`)** for the main card. Do **not** introduce a separate “gray SaaS” card palette. If a darker inset is needed, document it here first—do not invent ad-hoc `#111827` unless this file is updated to match product.

## Forbidden (new auth/admin)

- Bright **emerald** as primary CTA or dominant chrome (legacy marketing green is not the auth/admin system).
- Generic light-gray **SaaS dashboard** cards on auth routes.
- Centered **tiny** auth island on large desktops without the structured layout in [AUTH_UI_RULES.md](AUTH_UI_RULES.md).
- **Horizontal scroll** navigation for primary filters (use wrap/stack).
- Multiple competing primary CTAs in one auth panel.

## Layout constraints

- **Max content width:** 420px mobile, 480px desktop for the **auth card column**.
- **Desktop:** Left brand / trust panel + right auth card per [AUTH_UI_RULES.md](AUTH_UI_RULES.md).
- **Mobile:** Stacked; brand block above card.
- Respect **8pt grid** and radii from [DESIGN_TOKENS.md](DESIGN_TOKENS.md).

## References

- [AUTH_UI_RULES.md](AUTH_UI_RULES.md)
- [UIUX_GUARDRAILS.md](UIUX_GUARDRAILS.md)
- [COMPONENT_STANDARDS.md](COMPONENT_STANDARDS.md)
