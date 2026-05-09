# History Screen

## User Goal
Find and inspect past transactions quickly.

## Primary CTA
Search transactions.

## Secondary CTA
Apply filters.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- Sticky search
- Filter chips
- Grouped TransactionRow list
- EmptyState

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Search remains easy to reach.
- Max 3 visible filters before more menu.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Search target <300ms.
- Paginate 50 rows.

## AI Restrictions
- No table UI on mobile.
- No horizontal scroll.
