# HexaTrack Cursor Prompt

You are building HexaTrack, a production-grade finance workspace platform.

Always begin with [docs/READ_FIRST.md](docs/READ_FIRST.md). It defines which docs to read for the current task and prevents documentation overload.

## Non-Negotiables

- Workspace System is P0.
- Do not add random features before the current task is complete.
- Use the approved design tokens only.
- Use Lucide React only for icons.
- Validate inputs with Zod on frontend and FluentValidation on backend.
- Use EF Core migrations for backend schema changes.
- Never commit secrets.
- Never duplicate transactions.
- Never mismatch transfer balances.
- Never overwrite historical exchange rates.

## Public Infrastructure


- Frontend: Vercel project `prj_ZRflShF6XZCLwuKfnwj1E6DGfDYf`
- Backend: Render service `srv-d7vc7jho3t8c73cpg22g`, URL `https://hexatrack.onrender.com`
- Database host: `dpg-d7vc7areo5us73eiqrsg-a`
- GitHub: `https://github.com/ANANDU-2000/HexaTrack.git`


Real secrets belong only in local/private env or hosting dashboards.
