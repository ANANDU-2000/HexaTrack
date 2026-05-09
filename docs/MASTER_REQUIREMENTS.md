# HexaTrack Master Requirements

## Product Identity

HexaTrack is a premium finance workspace platform for personal, business, family, and future team finance separation.

## What It Is Not

- Not accounting software.
- Not ERP.
- Not crypto UI.
- Not a generic AI dashboard.

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion, Lucide React, Zod
- Backend: ASP.NET Core, EF Core, Npgsql, Hangfire, Redis, JWT
- Database: PostgreSQL

## Public Infrastructure


- Frontend: Vercel project `prj_ZRflShF6XZCLwuKfnwj1E6DGfDYf`
- Backend: Render service `srv-d7vc7jho3t8c73cpg22g`, URL `https://hexatrack.onrender.com`
- Database host: `dpg-d7vc7areo5us73eiqrsg-a`
- GitHub: `https://github.com/ANANDU-2000/HexaTrack.git`


No real passwords or API keys belong in committed docs.

## Design System


| Token | Value | Use |
| --- | --- | --- |
| `background` | `#0B1015` | App/page background |
| `surface` | `#121A22` | Cards, sheets, panels |
| `primary` | `#4F8CFF` | Primary CTA and selected state |
| `expense` | `#FF5C75` | Expense and destructive state |
| `success` | `#1FD18B` | Income and positive state |
| `border` | `rgba(255,255,255,0.06)` | Dividers and card borders |
| `textPrimary` | `#F5F7FA` | Primary text |
| `textMuted` | `#8B9BB4` | Secondary text |


See [DESIGN_TOKENS.md](DESIGN_TOKENS.md) for the hard token lock.

## Palette Conflict Rule

Some older drafts proposed `#8B5CF6` as primary. The approved HexaTrack palette uses `#4F8CFF`. Do not mix both in UI or docs. If you ever migrate primary color, update `DESIGN_TOKENS.md`, `VISUAL_SYSTEM.md`, Tailwind theme tokens, and components in one deliberate pass.

## Core Data Model

```text
User
  Workspace
    WorkspaceMember
    Account
    Category
      Subcategory
    Transaction
    RecurringItem
    Budget
```

## Current Priority

Workspace System is P0. Every account, category, transaction, recurring item, report, and dashboard query must be workspace-scoped.

## Migration Standard

EF Core migrations are canonical for backend database changes. Legacy SQL files are historical/reference only unless explicitly approved.
