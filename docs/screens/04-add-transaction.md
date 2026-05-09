# Add Transaction Screen

## User Goal
Add an expense or income in under 5 seconds.

## Primary CTA
Save transaction.

## Secondary CTA
Add optional note/details.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- Amount input
- Recent categories
- Account selector
- Sticky PrimaryButton

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Amount field autofocuses.
- Numeric keyboard opens where supported.
- Save stays above keyboard.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Save action immediate with clear loading state.

## AI Restrictions
- Do not expose advanced fields by default.
- No multi-step required flow.
