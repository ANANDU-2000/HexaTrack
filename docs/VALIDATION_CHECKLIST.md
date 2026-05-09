# Validation checklist (per feature slice)

Use with [OUTPUT_SUMMARY_TEMPLATE.md](OUTPUT_SUMMARY_TEMPLATE.md). Tick only what applies.

## UI

- [ ] Spacing matches [DESIGN_TOKENS.md](DESIGN_TOKENS.md) / [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md)
- [ ] One primary CTA per auth/marketing section where applicable
- [ ] No forbidden patterns in [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md) (e.g. emerald-primary CTAs on new auth/admin surfaces)
- [ ] Mobile ~375px
- [ ] Tablet/desktop breakpoints if layout splits
- [ ] Safe-area insets (`env(safe-area-inset-*)`) on notched devices where relevant
- [ ] Keyboard: focus order, submit on enter where expected

## API

- [ ] Success path returns expected shape (camelCase JSON per [API_RESPONSE_STANDARD.md](API_RESPONSE_STANDARD.md))
- [ ] `401` unauthenticated
- [ ] `403` forbidden (role / workspace)
- [ ] `404` missing resource
- [ ] `400` / validation errors on bad body
- [ ] `500` surfaces generic safe message to client
- [ ] Workspace mismatch / wrong `X-Workspace-Id` rejected where applicable

## Security

- [ ] Workspace isolation for tenant routes
- [ ] Admin routes require super-admin (or policy) gate
- [ ] JWT validated; role claims enforced server-side

## Performance / resilience

- [ ] Loading state while awaiting API
- [ ] Empty state when no data
- [ ] Slow API: UI remains usable (disabled repeat submit, optional retry)
- [ ] Idempotent writes where finance rules require ([FINANCIAL_CALCULATION_RULES.md](FINANCIAL_CALCULATION_RULES.md))

## Tools

- [ ] Manual HTTP / Postman per [API_TESTING.md](API_TESTING.md) for this area
