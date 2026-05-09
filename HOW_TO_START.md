# HexaTrack How To Start

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

- Copy template values from [`.env.local`](.env.local) and [`.env.backend`](.env.backend).
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
