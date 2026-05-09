# HexaTrack API

Base URL: `https://hexatrack.onrender.com`

## Standards

- Auth: Bearer JWT except `/api/auth/*`
- Response shape: [API_RESPONSE_STANDARD.md](API_RESPONSE_STANDARD.md)
- Workspace-scoped routes require `X-Workspace-Id`
- Validation: [VALIDATION_RULES.md](VALIDATION_RULES.md)

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

## Workspaces

- `GET /api/workspaces`
- `POST /api/workspaces`
- `PUT /api/workspaces/{id}`
- `DELETE /api/workspaces/{id}`

## Workspace-Scoped Core

Headers: `Authorization`, `X-Workspace-Id`

- `GET /api/accounts`
- `GET /api/categories`
- `GET /api/transactions?from=&to=&page=&limit=`
- `POST /api/transactions`
- `GET /api/recurring-transactions`
- `GET /api/reports/summary?from=&to=`

## Search

- `GET /api/transactions/search?q=&from=&to=&categoryId=&accountId=&type=`
