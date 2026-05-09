# Admin Screen

## User Goal
Support users and monitor system health without unsafe clutter.

## Primary CTA
Search user/workspace.

## Secondary CTA
Open analytics or feature flags.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- Search
- Grouped admin sections
- Audit log
- Dangerous action zone

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Admin can be desktop-first but must remain responsive.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Paginate admin lists.

## AI Restrictions
- No raw secrets.
- No destructive action without confirmation and audit reason.
