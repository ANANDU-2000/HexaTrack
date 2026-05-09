# HexaTrack — Start Here (Master)

Single entry document for **humans and Cursor Pro**. It links deeper specs; it does not replace [MASTER_REQUIREMENTS.md](MASTER_REQUIREMENTS.md) or [CURSOR_MASTER_PROMPT.md](../CURSOR_MASTER_PROMPT.md).

---

## 1. What you are building

HexaTrack is a **calm, premium, mobile-first** finance workspace: workspaces, accounts, categories, transactions, recurring flows, reports — with strict **finance trust** rules (idempotency, DB transactions for writes, no silent balance corruption).

**Not:** accounting ERP, crypto neon UI, or generic “AI slop” dashboards.

**Icons:** Lucide React only — [ICONOGRAPHY.md](ICONOGRAPHY.md).  
**Colors:** locked palette — [DESIGN_TOKENS.md](DESIGN_TOKENS.md), [MASTER_REQUIREMENTS.md](MASTER_REQUIREMENTS.md).

---

## 2. Live infrastructure (reference)

| Item | Value |
| --- | --- |
| Repo | `https://github.com/ANANDU-2000/HexaTrack.git` |
| Vercel project ID | `prj_ZRflShF6XZCLwuKfnwj1E6DGfDYf` |
| Render API | `https://hexatrack.onrender.com` |
| Render service ID | `srv-d7vc7jho3t8c73cpg22g` |
| Postgres host label | `dpg-d7vc7areo5us73eiqrsg-a` |

**Secrets** (DB password, JWT signing key, Stripe/Razorpay/Anthropic keys): only in **Render env**, **Vercel env**, or **local** `.env.local` / private tooling — never in committed markdown.

Full checklist: [DEPLOYMENT_AND_ENV.md](DEPLOYMENT_AND_ENV.md).

---

## 3. Repo layout (short)

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md): `app/`, `components/`, `lib/`, `store/`, `backend/HexaTrack.Api/`, `docs/`, `features/`.

---

## 4. Local development (fast path)

```powershell
cd <your-clone>
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- API base URL: set in `.env.local` from [`.env.local.example`](../.env.local.example) (defaults in `lib/api.ts` fall back to `http://localhost:5014` if unset)

Backend (when developing API locally):

```powershell
dotnet build backend/HexaTrack.Api/HexaTrack.Api.csproj
# run from Visual Studio / `dotnet run` per backend README
```

Render health (production API):

```powershell
Invoke-WebRequest -Uri "https://hexatrack.onrender.com/health"
```

---

## 5. Cursor Pro — how to start a session

1. Attach the **HexaTrack** workspace root in Cursor.
2. Paste or enable rules from [CURSOR_MASTER_PROMPT.md](../CURSOR_MASTER_PROMPT.md) (or `.cursorrules` if synced).
3. Read [READ_FIRST.md](READ_FIRST.md) — it limits doc overload.
4. Read [CURRENT_TASK.md](CURRENT_TASK.md) for the active slice of work.
5. For **MCP** (Render logs, GitHub, Postgres inspection): [MCP_AND_CURSOR_SETUP.md](MCP_AND_CURSOR_SETUP.md).

**First implementation prompt (example):**

```text
Read docs/READ_FIRST.md, docs/CURRENT_TASK.md, features/feature-02-workspaces.md.
Implement only the Workspace System. Use EF migrations, workspace scoping on queries,
and finance trust rules. No unrelated UI or features.
```

---

## 6. How to finish the app (roadmap)

Canonical sequence:

1. [BUILD_ORDER.md](BUILD_ORDER.md) — delivery order  
2. [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md) — milestones  
3. [TODO_TASKS.md](TODO_TASKS.md) — checkbox backlog  

**Phase focus (summary):**

- **P0:** Workspaces (DB, API, `X-Workspace-Id`, frontend switcher) — see [features/feature-02-workspaces.md](../features/feature-02-workspaces.md)  
- **P1:** Subcategories, Add Transaction hardening, idempotency + transfers  
- **P2:** Dashboard real data, history search, reports  
- **Later:** Billing, admin, AI insights (per master prompt priorities)

**Definition of done** for any slice: typecheck/lint/build for touched stack, loading + empty + error states, mobile width check, no secrets in diff — see [BUILD_TO_FINISH_HEXATRACK.md](BUILD_TO_FINISH_HEXATRACK.md).

---

## 7. Requirements vs prompts (which file wins)

| Need | Document |
| --- | --- |
| Product + stack + palette + model | [MASTER_REQUIREMENTS.md](MASTER_REQUIREMENTS.md) |
| Long Cursor “constitution” | [CURSOR_MASTER_PROMPT.md](../CURSOR_MASTER_PROMPT.md) |
| Shorter duplicate / alternate prompt | [CURSOR_PROMPT.md](../CURSOR_PROMPT.md) |
| Conflicts between docs | [DOC_HIERARCHY.md](DOC_HIERARCHY.md) |

---

## 8. Deploy and env vars

- **Frontend:** [`.env.local.example`](../.env.local.example) + Vercel dashboard  
- **Backend:** [`.env.backend`](../.env.backend) + Render web service env  
- **Details:** [DEPLOYMENT_AND_ENV.md](DEPLOYMENT_AND_ENV.md)

---

## 9. Push and test (production)

1. Commit on `main` (or your release branch).  
2. Confirm **GitHub → Vercel** and **GitHub → Render** integrations fire (or deploy manually).  
3. Run smoke tests in [DEPLOYMENT_AND_ENV.md](DEPLOYMENT_AND_ENV.md) § Smoke tests.

---

## 10. Related “how to” files

| File | Use |
| --- | --- |
| [../HOW_TO_START.md](../HOW_TO_START.md) | Short commands |
| [CURSOR_PRO_START_AND_FINISH.md](CURSOR_PRO_START_AND_FINISH.md) | Cursor-only workflow |
| [READ_FIRST.md](READ_FIRST.md) | Minimal reading graph |
