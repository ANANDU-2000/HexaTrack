# syntax=docker/dockerfile:1
# Render (Docker): build from repo root; API is backend/HexaTrack.Api
FROM mcr.microsoft.com/dotnet/sdk:9.0-bookworm-slim AS build
WORKDIR /src

COPY backend/HexaTrack.Api/HexaTrack.Api.csproj ./backend/HexaTrack.Api/
RUN dotnet restore ./backend/HexaTrack.Api/HexaTrack.Api.csproj

COPY backend/HexaTrack.Api/ ./backend/HexaTrack.Api/
WORKDIR /src/backend/HexaTrack.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
COPY backend/HexaTrack.Api/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
