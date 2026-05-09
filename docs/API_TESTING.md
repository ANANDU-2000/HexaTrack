# API testing (manual / Postman)

Pair with [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md). Base URL: local `http://localhost:5014` or deployed API. Send `Authorization: Bearer <token>` except where noted.

## Auth

| # | Request | Expect |
|---|---------|--------|
| A1 | `POST /api/auth/login` valid body | `200`, `accessToken`, user |
| A2 | `POST /api/auth/login` bad password | `401` |
| A3 | `POST /api/auth/register` duplicate email | `4xx` / conflict message |

## Workspace context

| # | Request | Expect |
|---|---------|--------|
| W1 | Tenant route **without** `X-Workspace-Id` where required | `400` / problem detail |
| W2 | Tenant route with **wrong** workspace for user | `403` or empty/not found per API |

## Transactions

| # | Request | Expect |
|---|---------|--------|
| T1 | `GET /api/transactions` with workspace header | `200`, scoped data |
| T2 | `GET /api/transactions/search` with filters | `200`, `items`, `totalCount` |

## Permissions / admin

| # | Request | Expect |
|---|---------|--------|
| P1 | `GET /api/admin/*` as normal user | `403` |
| P2 | `GET /api/admin/*` as super admin | `200` / expected payload |

## Export

Save collections under version control as optional `postman/` or document variables: `baseUrl`, `token`, `workspaceId`.
