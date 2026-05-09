# State Management Rules

- Zustand owns auth, active workspace, finance cache, UI sheet/modal state, and filters.
- Server state must define refresh and invalidation behavior.
- Workspace switch clears workspace-scoped cached data.
- Avoid duplicate stores, random contexts, and deep prop drilling.
