# Render (Docker): build from repo root; API is backend/HexaTrack.Api
#
# There is no published tag `aspnet:9.0-bookworm` (non-slim) — only
# `9.0-bookworm-slim` / `9.0`. Use slim + install libicu to avoid missing ICU
# and reduce SIGSEGV risk on small hosts.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend/HexaTrack.Api/HexaTrack.Api.csproj ./backend/HexaTrack.Api/
RUN dotnet restore ./backend/HexaTrack.Api/HexaTrack.Api.csproj

COPY backend/HexaTrack.Api/ ./backend/HexaTrack.Api/
WORKDIR /src/backend/HexaTrack.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu72 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
COPY backend/HexaTrack.Api/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
