# Validation Rules

- Frontend: Zod.
- Backend: FluentValidation.
- Service layer validates business invariants.
- Validate workspace, account, category, subcategory, amount, currency, date, and idempotency key.
- Do not duplicate ad hoc validation across components/controllers.
