# MCP and Cursor Setup (Render, Postgres, GitHub)

This project ships a **template** at [`.cursor/mcp.json`](../.cursor/mcp.json). MCP runs on **your machine**; secrets belong in **your** Cursor MCP config or environment, not in committed files.

## What is already wired in the template

| Server | Purpose |
| --- | --- |
| `render` | `@render-mcp/server` — list services, logs, deploys, metrics; optional env updates **if** your Render API key is configured |
| `github` | `@modelcontextprotocol/server-github` — issues, PRs, repo search (requires a GitHub PAT with least privilege) |
| `postgres` | `@modelcontextprotocol/server-postgres` — ad-hoc SQL / schema inspection (requires a **database URL** you paste locally) |
| `filesystem` | Scoped folder access for the agent |

`RENDER_SERVICE_ID` in the template is set to **`srv-d7vc7jho3t8c73cpg22g`** so Cursor can target the correct Render web service once you add `RENDER_API_KEY`.

## One-time setup steps

1. **Render API key**  
   Render Dashboard → Account → **API Keys** → create a key. Put it in your private MCP env as `RENDER_API_KEY` (see Render MCP docs for the exact variable name your server expects — the template uses `RENDER_API_KEY`).

2. **Postgres MCP `DATABASE_URL`**  
   Use the connection string from **Render → PostgreSQL → Connect** (prefer **internal** URL if your MCP runs inside something that can reach it; most developers use **external** URL from their laptop for inspection only).  
   **Do not** commit this string to the repo.

3. **GitHub PAT**  
   Create a fine-scoped token for repo read (and write only if you need PR creation from MCP).

4. **Filesystem path**  
   Replace `<absolute-path-to-HexaTrack>` in `mcp.json` with your actual clone path so the filesystem server is scoped correctly.

## Vercel

There is **no** Vercel project ID “key” for MCP in this repo. Vercel deployment and env management are done in the **Vercel dashboard** (project `prj_ZRflShF6XZCLwuKfnwj1E6DGfDYf`) or Vercel CLI with a **personal token**. If you add a third-party “Vercel MCP” later, follow that server’s schema and keep tokens out of git.

## Verifying connectivity

| Check | How |
| --- | --- |
| Render API up | Browser or `Invoke-WebRequest https://hexatrack.onrender.com/health` |
| Render MCP | After `RENDER_API_KEY` is set, use MCP “list services” / “get service” for `srv-d7vc7jho3t8c73cpg22g` |
| DB from laptop | `psql` or Postgres MCP using **external** URL from Render (if firewall allows) |
| Frontend → backend | Production site loads; login works; network tab shows API origin matching `NEXT_PUBLIC_API_BASE_URL` |

## Conflict with team templates

If multiple developers share the repo, keep **committed** `mcp.json` generic and use Cursor’s **user-level** MCP overrides for personal keys so nothing secret lands in git.
