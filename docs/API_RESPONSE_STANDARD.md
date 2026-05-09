# API Response Standard

## JSON Rules

- camelCase keys only.
- No one-off response shapes.
- HTTP status code must match outcome.

## Success Envelope

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## Error Envelope

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "validation_failed",
    "message": "Validation failed.",
    "details": {}
  },
  "meta": {}
}
```

## Pagination Meta

```json
{
  "page": 1,
  "limit": 50,
  "total": 0,
  "hasMore": false
}
```

## Standard Codes

- `validation_failed`
- `unauthorized`
- `forbidden`
- `not_found`
- `conflict`
- `rate_limited`
- `idempotency_conflict`
- `internal_error`
