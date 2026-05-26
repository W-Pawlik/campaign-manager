# Authentication and Authorization

## Authentication Model

Implemented model is hybrid:

- Access token (`JWT`) is stateless and sent as `Authorization: Bearer ...`.
- Refresh token is stored in `HttpOnly` cookie and backed by server-side `user_sessions` records.

## Why `user_sessions` Exists

`user_sessions` is used for refresh-token lifecycle control:

- token rotation
- explicit revocation (logout)
- invalidation of previously used refresh tokens

This does not contradict stateless API access tokens. It is a common production pattern.

## Request Handling

1. Protected endpoint checks access token in auth middleware.
2. If access token is valid, request proceeds.
3. If access token is invalid/expired, API returns `401`.
4. Client should call refresh endpoint, receive new access token, then retry request.

## Authorization

Authorization is handled in application/domain logic (for example campaign role checks). Typical roles include `OWNER`, `GM`, `PLAYER`.