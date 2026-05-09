# HexaTrack Project Structure

This is the **current** layout of the main repository (Next.js frontend + ASP.NET Core API in one tree).

## Root

| Path | Role |
| --- | --- |
| `app/` | Next.js 15 App Router pages and layouts |
| `components/` | React UI components |
| `lib/` | API client, types, shared frontend utilities (`api.ts` reads `NEXT_PUBLIC_API_BASE_URL`) |
| `store/` | Zustand stores (auth, finance, workspace context) |
| `public/` | Static assets, PWA manifest |
| `backend/HexaTrack.Api/` | ASP.NET Core API, EF Core, Hangfire, JWT |
| `docs/` | Product, UX, API, security, and delivery documentation |
| `features/` | Feature specs referenced by `docs/READ_FIRST.md` |
| `hexatrack-docs/` | Legacy/duplicate doc bundle (prefer root `docs/` + `features/` for new work) |
| `supabase/` | Legacy or auxiliary SQL (confirm before relying on paths) |
| `.cursor/mcp.json` | **Template** for MCP servers (keys stay local/private) |
| `.env.backend` | **Template** for Render/local backend variables (placeholders only in git) |
| `CURSOR_MASTER_PROMPT.md` | Long-form Cursor rules for this product |
| `HOW_TO_START.md` | Short local run + validation commands |

## Backend (C#)

| Path | Role |
| --- | --- |
| `backend/HexaTrack.Api/Program.cs` | App composition, middleware, DI |
| `backend/HexaTrack.Api/Controllers/` | HTTP API surface |
| `backend/HexaTrack.Api/Data/` | DbContext, migrations |
| `backend/HexaTrack.Api/README.md` | API-specific notes |

## Frontend conventions

- **Icons:** Lucide React only — see [ICONOGRAPHY.md](ICONOGRAPHY.md).
- **Design tokens:** [DESIGN_TOKENS.md](DESIGN_TOKENS.md), [UI_SYSTEM_LOCK.md](UI_SYSTEM_LOCK.md).
- **Finance safety:** [FINANCIAL_CALCULATION_RULES.md](FINANCIAL_CALCULATION_RULES.md).

## Doc hierarchy

When documents disagree, follow [DOC_HIERARCHY.md](DOC_HIERARCHY.md). For “what to build next,” use [TODO_TASKS.md](TODO_TASKS.md) and [BUILD_ORDER.md](BUILD_ORDER.md).
