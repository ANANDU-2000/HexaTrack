# HexaTrack Doc Hierarchy

## Canonical Sources

1. [READ_FIRST.md](READ_FIRST.md)
2. [BUILD_ORDER.md](BUILD_ORDER.md) — **sequence** for major work (auth/admin first).
3. [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md) — stack, DoD, laws.
4. [MASTER_REQUIREMENTS.md](MASTER_REQUIREMENTS.md)
5. [CURRENT_TASK.md](CURRENT_TASK.md)
6. Relevant feature and screen docs

**Sequencing conflict:** If [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md) step order disagrees with [BUILD_ORDER.md](BUILD_ORDER.md), use **BUILD_ORDER** for **what to build next** after both files exist.

UI lock for **new** auth/admin surfaces: [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md).

## Mirrors

`hexatrack-docs/` is a mirror/pointer area only. Root `docs/` and root `features/` win.

## Prompts

`.cursorrules`, [../CURSOR_PROMPT.md](../CURSOR_PROMPT.md), and [../CURSOR_MASTER_PROMPT.md](../CURSOR_MASTER_PROMPT.md) summarize rules. They must not introduce conflicting architecture.

## Legacy

Legacy Supabase SQL migrations are historical/reference only. EF Core migrations are canonical for backend schema changes.

## Docs Freeze

After this docs pass, do not add more planning docs unless implementation is blocked by a real missing decision.

**Exception:** Governance files ([BUILD_ORDER.md](BUILD_ORDER.md), [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md), [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md), [AUTH_UI_RULES.md](AUTH_UI_RULES.md)) may be updated when execution proves a gap.
