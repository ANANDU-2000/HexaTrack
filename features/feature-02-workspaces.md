# Feature 02: Workspaces

Status: P0, not started.

## Goal

Separate all finance data by workspace while preventing data leaks.

## Workspace Types

- Personal
- Business
- Family

## Database

- Add `Workspace`: id, userId, name, type, currency, isDefault, createdAt, updatedAt.
- Add `WorkspaceMember`: id, workspaceId, userId, role, createdAt.
- Add `workspaceId` to accounts, categories, transactions, recurring items.
- Backfill each user into a default Personal workspace.
- Add indexes for user/workspace lookups.

## Backend

- `GET /api/workspaces`
- `POST /api/workspaces`
- `PUT /api/workspaces/{id}`
- `DELETE /api/workspaces/{id}`
- Validate `X-Workspace-Id` on scoped endpoints.
- Verify user membership and role.
- Scope accounts, categories, transactions, recurring, reports, dashboard.

## Frontend

- Workspace type.
- Workspace API methods.
- Active workspace in Zustand.
- Inject `X-Workspace-Id` in API client.
- WorkspaceSwitcher.
- CreateWorkspaceModal.
- Empty/loading/error states.

## Acceptance Criteria

- No data leaks between workspaces.
- Default workspace exists after registration/backfill.
- Switching workspace refreshes scoped data.
- Cannot delete workspace with financial history unless explicit future safe flow exists.
