# Auth UI rules

Defines **structure and priority** for authentication-related screens. Copy tone stays minimal and factual—no motivational finance slogans.

## Flow priority

1. **Invite acceptance** (primary path for team workspaces): token link → set password (if needed) → enter workspace.
2. **Login** (minimal): email + password; secondary links as needed.
3. **Register** (secondary): used when invite-free signup is allowed; must not overshadow invite flow.

## Layout

### Desktop (viewport lg+)

- **Left column:** Brand mark, short premium positioning line, optional static trust hints (security, workspace context). No live analytics widgets unless product-spec’d.
- **Right column:** Single **auth card** on `surface` token ([DESIGN_TOKENS.md](DESIGN_TOKENS.md), [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md)).

### Mobile

- Stacked: compact brand block, then auth card full width within max-width constraint.

## Components

- **Primary CTA:** `primary` token only (`#4F8CFF`).
- **Inputs:** Match radius/spacing from [DESIGN_TOKENS.md](DESIGN_TOKENS.md).
- **One primary action** per panel (submit).

## Onboarding

Workspace onboarding **after** invite/login is a **separate step** from the auth card—do not cram onboarding into the same sheet as password fields unless explicitly specified.

## Related backend flows

Invite tokens, expiry, and membership assignment must be specified in `features/feature-xx-invites.md` before implementation; API contracts live next to implementation PRs.
