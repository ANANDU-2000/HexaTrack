# Dashboard Screen

## User Goal
Understand current workspace money at a glance.

## Primary CTA
Add transaction.

## Secondary CTA
Switch workspace or open reports.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- WorkspaceSwitcher
- Summary strip
- One trend chart
- CategoryBreakdown
- Recent transactions
- AI insight

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Important summary stays above fold.
- No long dashboard.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Load target <2s.
- Recent transactions limited to 5.

## AI Restrictions
- No decorative charts.
- No extra dashboard widgets.
