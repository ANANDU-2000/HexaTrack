# HexaTrack Current Task

## P0: Workspace System

Status: Implemented (migration, `X-Workspace-Id`, scoped services, frontend switcher + create modal).

## P1: Subcategory System

Status: Implemented — nested REST, leaf-category validation, Add Transaction / Add Recurring pickers, Settings → Categories for top-level create + subcategory add/remove.

## P2: Dashboard (real API)

Status: Implemented — `GET /api/dashboard/summary`, finance store `dashboard` + `loadWorkspace` bundle, [components/screens/dashboard-screen.tsx](../components/screens/dashboard-screen.tsx) uses server totals, insight line, recent transactions, recurring due soon, report-backed visuals.

## P3: History (server search)

Status: Implemented — [lib/api.ts](../lib/api.ts) `transactions.search`, [components/screens/history-screen.tsx](../components/screens/history-screen.tsx) debounced query, type filters, pagination, loading/empty/error.

## P4: Reports (date ranges)

Status: Implemented — period toggles (Week / Month / Year / All) fetch [GET /api/reports/summary](../backend/HexaTrack.Api/Api/Controllers/ReportsController.cs) with computed `from`/`to`; single primary trend visualization per screen caps.

## User flow (after login)

1. Auth succeeds → token stored.
2. Workspace store hydrates → active workspace resolved (`ensureActiveWorkspace`).
3. Finance `loadWorkspace()` runs: accounts, categories, tags, recurring, transactions (month-to-date), dashboard summary (embeds report for that range).
4. User lands on Home (dashboard) with bottom nav / sidebar; History and Reports load their own data as configured above.

## Auth + Super Admin foundation

Status: Implemented — JWT `SuperAdmin` role claim, `SuperAdmin:BootstrapEmails` bootstrap, `/api/auth/me`, `/api/auth/invite/accept`, workspace invites (`POST /api/workspaces/{id}/invites`), admin APIs under `/api/admin/*` (users, audit, feature flags, global settings, workspaces list, AI usage summary), skip `X-Workspace-Id` for `/api/admin`. Frontend: [`app/admin/page.tsx`](../app/admin/page.tsx), invite acceptance [`app/invite/page.tsx`](../app/invite/page.tsx), auth shell per [`AUTH_UI_RULES.md`](AUTH_UI_RULES.md) / [`UI_SYSTEM_LOCK.md`](UI_SYSTEM_LOCK.md).

## Read Before Implementation

1. [READ_FIRST.md](READ_FIRST.md)
2. [BUILD_ORDER.md](BUILD_ORDER.md) (canonical sequencing; overrides conflicts with older roadmaps)
3. [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md)
3. [../features/feature-02-workspaces.md](../features/feature-02-workspaces.md)
4. [WORKSPACE_PERMISSIONS.md](WORKSPACE_PERMISSIONS.md)
5. [API_RESPONSE_STANDARD.md](API_RESPONSE_STANDARD.md)
6. [FINANCIAL_CALCULATION_RULES.md](FINANCIAL_CALCULATION_RULES.md)

## Scope (optional polish)

- Icon/color pickers on category screens when you prioritize visual customization.
- Align all screens to [DESIGN_TOKENS.md](DESIGN_TOKENS.md) (dark tokens) — incremental pass.

## Planned / Not Shipped Yet

- Billing.
- AI insights / categorize endpoints beyond stubs.
- Full super admin UX (search filters, subscription UI, flags editor beyond minimal directory).
- Multi-currency exchange snapshots beyond workspace currency field.
- Deep observability and automated test suite (add with CI).

### Next product slices

Follow [BUILD_ORDER.md](BUILD_ORDER.md) from the current step; use [OUTPUT_SUMMARY_TEMPLATE.md](OUTPUT_SUMMARY_TEMPLATE.md) and [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) per vertical.
