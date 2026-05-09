# Super Admin Rules

Super admin actions require **authenticated identity**, **explicit super-admin role** (server-enforced), and **audit logs**. UI must follow [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md) and [DESIGN_TOKENS.md](DESIGN_TOKENS.md).

## Role model

- **Super admin** is a **global** role on the user record (not workspace-scoped). Tenant APIs remain scoped by workspace; admin APIs use separate controllers under `/api/admin/*` with policy **`SuperAdmin`**.
- Workspace roles (`WorkspaceRole`) remain unchanged for member permission inside a workspace ([WORKSPACE_PERMISSIONS.md](WORKSPACE_PERMISSIONS.md)).

## Ordered delivery (foundation)

1. Admin authorization (JWT claim + policy gate).
2. User directory APIs (list/search; lock/unlock account).
3. Workspace listing / membership visibility for support (read-heavy first).
4. Subscription/plan override hooks ([BILLING_SYSTEM.md](BILLING_SYSTEM.md)) — audit required.
5. Feature flags / kill switches ([FEATURE_FLAGS.md](FEATURE_FLAGS.md)) — persist changes + audit.
6. AI provider configuration (non-secret metadata only; secrets stay in env — [API_KEY_MANAGEMENT.md](API_KEY_MANAGEMENT.md)).
7. Usage counters / analytics surfaces for abuse and cost (read APIs first).
8. Email / notification hooks for admin-triggered messages (integrate when mail provider exists).
9. Lock/unlock user (blocks login when locked).
10. Audit log append-only for every mutating admin action.

## Allowed capabilities (non-exhaustive)

- Lock/unlock user, force logout (when session store supports it).
- Plan override / trial extension (with audit).
- Reset onboarding flags (with audit).
- Disable features globally ([FEATURE_FLAGS.md](FEATURE_FLAGS.md)).
- Regional or provider switches (with audit).

Dangerous actions require **confirmation** in UI and **reason** stored in audit metadata where applicable.

## Security

- Raw secrets and payment instruments must **never** appear in API responses or audit payloads.
- All admin writes run through validation and server-side checks (never trust query params alone).
- See [SECURITY.md](SECURITY.md) and [ABUSE_PROTECTION.md](ABUSE_PROTECTION.md).

## Audit

- Append-only audit records: actor id, action key, target type/id, timestamp, optional JSON metadata (no PII beyond what’s necessary).
- Flag and billing overrides **must** emit audit ([FEATURE_FLAGS.md](FEATURE_FLAGS.md)).

## Related docs

- [BILLING_SYSTEM.md](BILLING_SYSTEM.md)
- [FEATURE_FLAGS.md](FEATURE_FLAGS.md)
- [API_RESPONSE_STANDARD.md](API_RESPONSE_STANDARD.md)
