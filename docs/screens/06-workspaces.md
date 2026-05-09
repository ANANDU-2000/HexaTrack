# Workspaces Screen

## User Goal
Create and switch finance contexts without data leakage.

## Primary CTA
Create workspace.

## Secondary CTA
Switch workspace.

## Max Interactions
- Main job must complete in 5 taps or fewer unless a security confirmation is required.
- Never add nested tabs or extra setup steps without updating this doc first.

## Allowed Components
- WorkspaceSwitcher
- Workspace cards
- CreateWorkspaceModal

## Loading State
- Use section skeletons that preserve layout.
- Do not show a blank screen.

## Empty State
- One Lucide icon, one short title, one concise subtitle, and one optional CTA.
- No giant illustrations or motivational filler.

## Error State
- Show a calm message, one retry action where useful, and no raw exception details.

## Mobile Behavior
- Workspace switch visible and reachable.

## Accessibility
- 44px minimum tap targets.
- Clear labels for controls and fields.
- Preserve focus order and support reduced motion.

## Performance Limits
- Switching workspace refreshes scoped data without stale leak.

## AI Restrictions
- No hidden active workspace.
- No delete without confirmation.
