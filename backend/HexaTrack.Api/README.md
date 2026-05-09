# HexaTrack AI Backend

Production-oriented ASP.NET Core Web API backend for HexaTrack AI.

## Project Structure

```text
HexaTrack.Api
├── Api
│   ├── Controllers
│   └── ErrorHandlingMiddleware.cs
├── Application
│   ├── Dtos
│   ├── Security
│   └── Services
├── Domain
│   ├── Entities
│   └── Enums.cs
├── Infrastructure
│   ├── Repositories
│   └── HexaTrackDbContext.cs
├── Program.cs
└── appsettings.json
```

The layering follows `Controller -> Service -> Repository -> DbContext`. Write operations run through `IUnitOfWork.ExecuteInTransactionAsync`, which opens an EF Core database transaction and commits only after all balance/category/tag/split changes succeed.

## Models

- `User`: email/password or Google identity, JWT subject.
- `Account`: cash, bank, wallet with currency and persisted balance.
- `Transaction`: income/expense ledger row tied to account, category, and tags.
- `Category`: parent/subcategory hierarchy scoped by user and transaction type.
- `Tag`: reusable user-scoped labels.
- `RecurringTransaction`: active schedule template processed by Hangfire.
- `ExpenseGroup`, `GroupMember`, `GroupExpense`, `GroupExpenseSplit`: equal/custom group splitting.

## Infrastructure

- PostgreSQL via EF Core/Npgsql.
- Redis via `StackExchange.Redis` for report caching.
- Hangfire PostgreSQL storage and server.
- JWT bearer auth and Google ID token login.
- Query indexes are configured in `HexaTrackDbContext` for user/date/category/account/report access patterns.

## API Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google

GET    /api/accounts
POST   /api/accounts
PUT    /api/accounts/{id}

GET    /api/categories
POST   /api/categories

GET    /api/tags
POST   /api/tags

GET    /api/transactions?from=2026-01-01&to=2026-01-31
POST   /api/transactions

GET    /api/recurring-transactions
POST   /api/recurring-transactions

POST   /api/groups
POST   /api/groups/{groupId}/expenses

GET    /api/reports/summary?from=2026-01-01&to=2026-12-31
```

## Background Jobs

`Program.cs` registers a Hangfire recurring job:

```text
HexaTrack-recurring-transactions -> hourly
```

It processes due recurring transactions in ACID transactions, creates ledger entries, updates account balances, and advances or disables schedules.

## Run

Update `appsettings.json` or environment variables for:

```text
ConnectionStrings__Postgres
ConnectionStrings__Redis
Jwt__Issuer
Jwt__Audience
Jwt__SigningKey
Google__ClientId
```

Then run:

```powershell
dotnet restore
dotnet ef migrations add InitialHexaTrackSchema
dotnet ef database update
dotnet run
```

In development, OpenAPI is exposed at `/openapi/v1.json` and Hangfire Dashboard at `/jobs`.

