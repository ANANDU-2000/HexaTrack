# Financial Calculation Rules

- Store amounts as decimal(12,2).
- Use explicit rounding for display only.
- Transfers debit and credit in one transaction.
- Income, expense, and transfer totals are separate.
- Historical exchange rates are immutable snapshots.
- Recurring creates are idempotent per period.
- Soft-deleted transactions are excluded from active totals but retained for audit.
