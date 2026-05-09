# Cursor Pro — Start and Finish HexaTrack

Use this with [START_HERE_MASTER.md](START_HERE_MASTER.md) (full hub). This page is **Cursor-specific** only.

## At the start of every session

1. Open [READ_FIRST.md](READ_FIRST.md).  
2. Open [CURRENT_TASK.md](CURRENT_TASK.md).  
3. Open the one feature doc you are implementing under `features/`.  
4. If touching UI: [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md), [DESIGN_TOKENS.md](DESIGN_TOKENS.md).  
5. If touching money: [FINANCIAL_CALCULATION_RULES.md](FINANCIAL_CALCULATION_RULES.md).

## Paste-once system prompt

Use the content of [CURSOR_MASTER_PROMPT.md](../CURSOR_MASTER_PROMPT.md) as your Cursor **Rules** or first message for greenfield work in this repo. It encodes stack, design system, finance laws, and priorities.

## MCP (optional but powerful)

Follow [MCP_AND_CURSOR_SETUP.md](MCP_AND_CURSOR_SETUP.md):

- **Render MCP:** needs `RENDER_API_KEY` locally; `RENDER_SERVICE_ID` is already `srv-d7vc7jho3t8c73cpg22g` in the template.  
- **Postgres MCP:** needs `DATABASE_URL` from Render dashboard (never commit).  
- **Vercel:** manage in dashboard; project id is **not** a secret API key.

## Finish line (what “done” looks like)

Work down [TODO_TASKS.md](TODO_TASKS.md) in order. After each PR or merge:

- `npm run typecheck` (frontend touched)  
- `dotnet build backend/HexaTrack.Api/HexaTrack.Api.csproj` (backend touched)  
- Manual: 375px width, empty/loading/error paths, workspace isolation if applicable  

Update [PROGRESS.md](PROGRESS.md) or [CURRENT_TASK.md](CURRENT_TASK.md) when a phase boundary moves.

## When stuck

- Re-read [DOC_HIERARCHY.md](DOC_HIERARCHY.md) for which spec wins.  
- Shrink scope: one vertical (e.g. “workspace API only”) per change set.  
- Do not add features outside the current [BUILD_ORDER.md](BUILD_ORDER.md) step.
