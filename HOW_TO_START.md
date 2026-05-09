# HexaTrack How To Start

## Master hub (read this first)

- [docs/START_HERE_MASTER.md](docs/START_HERE_MASTER.md) — infrastructure IDs, env templates, Cursor workflow, finish roadmap  
- [docs/CURSOR_PRO_START_AND_FINISH.md](docs/CURSOR_PRO_START_AND_FINISH.md) — Cursor Pro session checklist  
- [docs/DEPLOYMENT_AND_ENV.md](docs/DEPLOYMENT_AND_ENV.md) — Vercel, Render, PostgreSQL, smoke tests  
- [docs/MCP_AND_CURSOR_SETUP.md](docs/MCP_AND_CURSOR_SETUP.md) — Render/GitHub/Postgres MCP  
- [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) — folder map  
- Frontend env template: [`.env.local.example`](.env.local.example) → copy to `.env.local` (gitignored)

## Read First

Before any implementation, read [docs/READ_FIRST.md](docs/READ_FIRST.md). It explains the shortest safe reading path for each task.

## Local Frontend

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend Health Check

```powershell
Invoke-WebRequest -Uri "https://hexatrack.onrender.com/health"
```

Render free tier can cold-start slowly.

## Safe Environment Setup

- Copy [`.env.local.example`](.env.local.example) to `.env.local` and adjust.
- Use [`.env.backend`](.env.backend) as the checklist for Render/local backend variables.
- Replace placeholders locally or in Render/Vercel dashboards.
- Never commit real secrets.

## MCP Setup

[`.cursor/mcp.json`](.cursor/mcp.json) is a placeholder template. Put real API keys only in your local private config.

## First Implementation Prompt

```text
Read docs/READ_FIRST.md, docs/CURRENT_TASK.md, features/feature-02-workspaces.md, and the relevant screen docs.
Implement the Workspace System only.
Do not add unrelated features.
Use EF Core migrations and preserve all finance trust rules.
```

## Validation Before Merge

- Run `npm run typecheck` for frontend changes.
- Run `dotnet build backend/HexaTrack.Api/HexaTrack.Api.csproj` for backend changes.
- Manually test mobile width, keyboard overlap, empty/loading/error states, and workspace data isolation.
