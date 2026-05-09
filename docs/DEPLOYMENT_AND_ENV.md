# Deployment, URLs, and Environment Variables

This file is the **operational checklist** for Vercel (frontend), Render (API + optional Redis), and Render PostgreSQL. It intentionally **does not** contain real passwords, signing keys, or provider secrets. Copy values from your hosting dashboards into local `.env.local` (frontend) and Render **Environment** (backend).

## Public identifiers (non-secret)

| Resource | Value |
| --- | --- |
| GitHub repository | `https://github.com/ANANDU-2000/HexaTrack.git` |
| Vercel project ID | `prj_ZRflShF6XZCLwuKfnwj1E6DGfDYf` |
| Render web service ID | `srv-d7vc7jho3t8c73cpg22g` |
| Public API URL | `https://hexatrack.onrender.com` |
| PostgreSQL instance hostname (public label) | `dpg-d7vc7areo5us73eiqrsg-a` |

**Note:** The Vercel **project ID** is not an API key. Vercel CLI and integrations use a separate **Vercel token** or OAuth; manage those in the Vercel account, not in this repo.

## Security

- If a database password, JWT signing key, or provider secret was ever pasted into chat, a ticket, or a public issue, **rotate it** in the Render or provider dashboard and update env vars everywhere they were used.
- Never commit `.env.local` or production connection strings. Use [`.env.local.example`](../.env.local.example) and [`.env.backend`](../.env.backend) as templates only.

## Frontend (Vercel)

Set in **Vercel → Project → Settings → Environment Variables** (same names as local):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Must point to your live API, e.g. `https://hexatrack.onrender.com` |
| `NEXT_PUBLIC_APP_NAME` | Display name |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | When billing UI is enabled |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | When billing UI is enabled |

After changing env vars, **redeploy** the frontend so the build picks them up.

## Backend (Render)

The repo includes a **root** [`Dockerfile`](../Dockerfile) for services that use Render’s **Docker** runtime. The image publishes `backend/HexaTrack.Api` and listens on Render’s `PORT` (`docker-entrypoint.sh` sets `ASPNETCORE_URLS`).

If your service is set to **Native** instead of Docker, switch the service to use the Dockerfile at repo root, or change the Render **Dockerfile path** field to `Dockerfile` (default when the file lives at the repository root).

Set in **Render → Web Service → Environment**. Canonical list and placeholders: [`.env.backend`](../.env.backend) in the repo.

### PostgreSQL connection

- Render provides **External** and **Internal** database URLs. Use the **Internal** URL for the API service running on Render (same region, lower latency, no public exposure of DB port where internal networking applies).
- Use the **External** URL only for local development or tools that run outside Render’s network.
- Map to your app’s expected keys (see `appsettings` / configuration in the API): commonly `ConnectionStrings__Postgres` and optionally `ConnectionStrings__PostgresInternal`.

### CORS

Ensure `Cors__AllowedOrigins__*` includes your real Vercel production URL (for example `https://hexatrack.vercel.app` or your custom domain) **and** `http://localhost:3000` for local dev.

### Redis

If the API expects Redis, create a Render **Redis** instance (or compatible URL) and set `ConnectionStrings__Redis` in the web service env.

## Smoke tests after deploy

1. **API health:** `GET https://hexatrack.onrender.com/health` (or the path your API exposes).
2. **CORS:** Open the Vercel site, sign in, confirm browser network calls to the API succeed (no CORS errors).
3. **Auth:** Register/login once on production with a throwaway account if needed.

Free Render tiers may **cold start**; the first request can be slow.

## Git push

Pushing to GitHub does not update Vercel or Render unless **Git integration** or **deploy hooks** are configured in those dashboards. Confirm each service is connected to the correct branch (usually `main`).
