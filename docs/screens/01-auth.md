# Auth Screen

## User Goal
Sign in or create an account with confidence and no clutter.

## Primary CTA
Continue with email/password or Google.

## Secondary CTA
Switch between login and register.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- Auth panel
- Inputs
- PrimaryButton
- Inline validation

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Form centered within thumb reach.
- Keyboard must not hide submit.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Auth screen interactive under 1 second after app shell loads.

## AI Restrictions
- No motivational copy.
- No extra onboarding before auth.
