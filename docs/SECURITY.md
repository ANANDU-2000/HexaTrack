# HexaTrack Security

## Secrets

- Never commit real secrets.
- Provider API keys stay backend-only.
- Admin UI must mask keys.
- Secret changes require audit logs.

## Auth

- JWT Bearer for API routes except auth.
- Refresh tokens should be httpOnly when implemented.
- Admin routes require role checks.

## Workspace Authorization

Every scoped request must validate:

- Authenticated user.
- Workspace membership.
- Role permission.
- Resource belongs to workspace.

## Finance Writes

- Validate input.
- Use DB transaction.
- Check idempotency.
- Write audit record where applicable.
- Roll back on failure.

## Abuse Protection

See [ABUSE_PROTECTION.md](ABUSE_PROTECTION.md).
