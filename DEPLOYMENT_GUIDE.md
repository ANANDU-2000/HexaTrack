# HexaTrack Deployment Guide

This document contains the configuration settings for deploying HexaTrack to Render.

## 1. Backend API (Web Service)

The backend is a .NET 9 API containerized with Docker.

### Render Configuration
- **Language**: `Docker`
- **Branch**: `main`
- **Root Directory**: `(Leave Empty)`
- **Instance Type**: `Free` (or Starter for production)
- **Region**: `Oregon (US West)`

### Required Environment Variables
| Key | Description |
| :--- | :--- |
| `ASPNETCORE_ENVIRONMENT` | Set to `Production` |
| `ConnectionStrings__Postgres` | `postgresql://user:password@host:port/dbname` (See [Database Section](#3-database-postgresql)) |
| `Jwt__SigningKey` | Secure 256-bit secret string |
| `Jwt__Issuer` | The URL of your API (e.g., `https://hexatrack-api.onrender.com`) |
| `Jwt__Audience` | `hexatrack-frontend` |
| `Cors__AllowedOrigins__0` | Your frontend URL (e.g., `https://hexatrack.vercel.app`) |

> [!NOTE]
> The `PORT` variable is automatically managed by Render. The `docker-entrypoint.sh` script handles the mapping.

---

## 2. Frontend (Next.js)

The frontend can be deployed as a **Static Site** (for optimized hosting) or a **Web Service**.

### Render Configuration (Static Site)
- **Language**: `Node`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `.next` (or `out` if using static export)
- **Root Directory**: `(Leave Empty)`

### Required Environment Variables
| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | The URL of your deployed Backend API (Render) |
| `NEXT_PUBLIC_APP_NAME` | `HexaTrack` |

---

## 3. Database (PostgreSQL)

Since you are using **Render PostgreSQL**:

1.  **Create Database**: Go to your Render Dashboard and click **New +** -> **PostgreSQL**.
2.  **Name it**: `hexatrack-db`.
3.  **Get Connection String**: Once created, scroll down to the **Connection** section.
4.  **Copy Internal URL**: Copy the **"Internal Connection String"**.
5.  **Add to API**: Paste it into the `ConnectionStrings__Postgres` environment variable in your **HexaTrack-Api** settings on Render.

> [!TIP]
> Always use the **Internal Connection String** when both the database and the web service are on Render. It is faster, more secure, and doesn't count against your bandwidth.


