# Backend Modules

## `auth`

Responsibility:

- register/login
- access token issuance and validation
- refresh token rotation and revocation
- logout
- current user identity query

Notable characteristics:

- access token: JWT, stateless
- refresh token: server-side session record (`user_sessions`) with hashed token
- refresh flow supports rotation and revoke-after-use

## `users`

Responsibility:

- read current user profile
- update profile fields
- change password
- soft-delete current user account

Notable characteristics:

- profile data split between `users` and `user_profiles`
- account deletion checks campaign ownership constraints

## `campaigns`

Responsibility:

- create campaign
- list campaigns for current user
- read campaign details
- update campaign
- archive/restore campaign
- soft-delete campaign

Business rules implemented:

- campaign is created by authenticated user
- creator becomes `OWNER` in `campaign_members`
- archived campaign cannot be normally edited
- delete operation is soft delete (`deletedAt`)
- slug is generated and kept unique

## Data Model (high level)

- `users`
- `user_profiles`
- `user_sessions`
- `campaigns`
- `campaign_members`