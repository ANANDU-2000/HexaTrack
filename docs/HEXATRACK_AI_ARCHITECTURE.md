# HexaTrack AI Architecture

This file is kept as an AI-facing architecture summary. The canonical project entry point is [READ_FIRST.md](READ_FIRST.md).

## Current Source Of Truth

- System architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- AI behavior and safety: [AI_SYSTEM_RULES.md](AI_SYSTEM_RULES.md)
- AI generation constraints: [AI_GENERATION_RULES.md](AI_GENERATION_RULES.md)
- API key handling: [API_KEY_MANAGEMENT.md](API_KEY_MANAGEMENT.md)
- Microcopy and insight tone: [MICROCOPY_GUIDE.md](MICROCOPY_GUIDE.md)

## AI Product Boundary

AI may summarize real user data, explain trends, suggest categorization, and detect anomalies. AI must not provide investment advice, hallucinate numbers, shame users, use motivational filler, or invent finance claims.

## Provider Boundary

Provider keys are backend-only. Admin UI may show masked key status and allow backend-controlled provider/model switching without exposing raw secrets.

## Implementation Order

Do not implement AI features before Workspace System, core transaction correctness, dashboard real data, and search/report foundations are stable.

