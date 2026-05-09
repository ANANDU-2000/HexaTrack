# Settings Screen

## User Goal
Manage account, workspace, notifications, subscription, AI, and danger zone.

## Primary CTA
Edit selected setting.

## Secondary CTA
Open support or billing.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- Grouped settings sections
- Toggles
- Danger zone

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Sections stay short and grouped.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Settings load fast from cached user/workspace state.

## AI Restrictions
- Only sections: Account, Notifications, Workspace, Subscription, AI, Danger Zone.
- No random toggles.
