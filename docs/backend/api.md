# Backend API Overview

## Health

- `GET /health`
- `GET /health/db`

## Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Users

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`
- `DELETE /api/v1/users/me`

## Campaigns

- `GET /api/v1/campaigns`
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/:campaignId`
- `PATCH /api/v1/campaigns/:campaignId`
- `POST /api/v1/campaigns/:campaignId/archive`
- `POST /api/v1/campaigns/:campaignId/restore`
- `DELETE /api/v1/campaigns/:campaignId`

## Error Semantics

- `401 Unauthorized`: authentication failure (missing/invalid/expired credentials)
- `403 Forbidden`: authenticated user lacks required permissions