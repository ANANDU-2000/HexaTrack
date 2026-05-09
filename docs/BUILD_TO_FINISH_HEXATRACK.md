# Build To Finish HexaTrack

## Product Vision

HexaTrack is a calm, premium, mobile-first finance workspace platform. It must feel native, fast, and trustworthy.

## Current Stack

- Frontend: Next.js 15, TypeScript, Tailwind, Zustand, Framer Motion, Lucide React, Zod
- Backend: ASP.NET Core, EF Core, Hangfire, Redis, JWT
- Database: PostgreSQL
- Frontend hosting: Vercel
- Backend hosting: Render

## Canonical Build Order

1. Freeze docs and remove secrets.
2. Build Workspace System.
3. Build accounts and category/subcategory foundation.
4. Connect Add Transaction flow.
5. Connect Dashboard to real API.
6. Build History search/filter.
7. Build Reports.
8. Build Billing/Admin.
9. Harden performance, security, observability, testing, import/export, and incident response.

## Implementation Law

- Do not add random features.
- Do not invent UI patterns.
- Do not bypass workspace scoping.
- Do not write finance data without validation, idempotency, transaction safety, and audit trail.

## Required Docs Map

- Task entry: [READ_FIRST.md](READ_FIRST.md), [CURRENT_TASK.md](CURRENT_TASK.md)
- UX: [UIUX_GUARDRAILS.md](UIUX_GUARDRAILS.md), [DESIGN_TOKENS.md](DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](COMPONENT_STANDARDS.md)
- Finance: [FINANCIAL_CALCULATION_RULES.md](FINANCIAL_CALCULATION_RULES.md)
- Backend: [API.md](API.md), [API_RESPONSE_STANDARD.md](API_RESPONSE_STANDARD.md), [VALIDATION_RULES.md](VALIDATION_RULES.md), [SECURITY.md](SECURITY.md)
- Workspace: [../features/feature-02-workspaces.md](../features/feature-02-workspaces.md), [WORKSPACE_PERMISSIONS.md](WORKSPACE_PERMISSIONS.md)

## Definition Of Done

- Type/lint/build checks pass for touched stack.
- Loading, empty, and error states are present.
- Mobile width is manually checked.
- Secret scan is clean.
- Progress docs are updated.
