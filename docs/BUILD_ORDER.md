# HexaTrack build order (canonical sequencing)

This document defines **delivery order** for major verticals. When it conflicts with older roadmaps, **this file wins for sequence** (see [DOC_HIERARCHY.md](DOC_HIERARCHY.md)). Stack, stack-specific DoD, and technical laws remain in [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md).

## Freeze rule (until auth + admin foundations pass gates)

**Do not add net-new** dashboard widgets, reports depth, or AI product features until steps **01–04** below meet [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) for their slice. Existing shipped screens may remain; **enhancements** wait.

## Ordered phases

| Step | Vertical | Notes |
|------|-----------|--------|
| 01 | Super Admin foundation | Roles, `/admin`, audit, flags/overrides, usage hooks |
| 02 | Premium auth redesign | Token-aligned UI per [AUTH_UI_RULES.md](AUTH_UI_RULES.md), [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md) |
| 03 | Invite onboarding | Invite-first acceptance; password set; workspace entry |
| 04 | Workspace onboarding | Post-invite steps; avoid bloating [app/page.tsx](../app/page.tsx) |
| 05 | Accounts | |
| 06 | Categories / subcategories | |
| 07 | Transactions | |
| 08 | Dashboard | After foundation UX lock |
| 09 | History | |
| 10 | Reports | |
| 11 | Recurring | |
| 12 | Notifications | |
| 13 | AI insights | |
| 14 | Billing | |
| 15 | Production hardening | Observability, tests, import/export |

## Cursor execution rule

One task = **one vertical slice**. Example: "Implement login shell UI only; no API change; follow [AUTH_UI_RULES.md](AUTH_UI_RULES.md) and [DESIGN_TOKENS.md](DESIGN_TOKENS.md); produce OUTPUT_SUMMARY using [OUTPUT_SUMMARY_TEMPLATE.md](OUTPUT_SUMMARY_TEMPLATE.md)."

Avoid single prompts that span auth + admin + dashboard.

## Related

- Current implementation tracker: [CURRENT_TASK.md](CURRENT_TASK.md)
- Visual lock: [DESIGN_TOKENS.md](DESIGN_TOKENS.md), [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md)
