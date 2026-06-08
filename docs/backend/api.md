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
  - Lists campaigns for the authenticated user.
  - Requires authentication.
- `POST /api/v1/campaigns`
  - Creates a campaign and assigns the authenticated user as `OWNER`.
  - Requires authentication.
  - Body:
    - `name`: string, required
    - `description`: string or null, optional
    - `gameSystemId`: UUID or null, optional
    - `visibility`: `PRIVATE`, `INVITE_ONLY`, or `PUBLIC_READ_ONLY`, optional
    - `defaultLanguage`: string or null, optional
    - `currentDateInWorld`: string or null, optional
    - `worldName`: string or null, optional
    - `startingLevel`: integer 1-30 or null, optional
- `GET /api/v1/campaigns/:campaignId`
  - Returns campaign details for an active campaign member.
  - Requires `campaign.read`.
- `PATCH /api/v1/campaigns/:campaignId`
  - Updates campaign metadata.
  - Requires `campaign.update`.
  - Body accepts the same editable fields as campaign creation. At least one field is required.
- `POST /api/v1/campaigns/:campaignId/cover-image-upload`
  - Creates a presigned cover image upload URL and stores the cover image reference.
  - Requires `campaign.update`.
  - Body:
    - `fileName`: string, required
    - `contentType`: `image/jpeg`, `image/png`, or `image/webp`, required
- `POST /api/v1/campaigns/:campaignId/archive`
  - Archives a campaign.
  - Requires `campaign.archive`.
- `POST /api/v1/campaigns/:campaignId/restore`
  - Restores an archived or soft-deleted campaign.
  - Requires `campaign.archive`.
- `DELETE /api/v1/campaigns/:campaignId`
  - Soft-deletes a campaign.
  - Requires `campaign.archive`.

## Campaign Members

- `GET /api/v1/campaigns/:campaignId/members`
  - Lists campaign members.
  - Requires `member.invite`.
- `POST /api/v1/campaigns/:campaignId/members/invite`
  - Creates a campaign invitation.
  - Requires `member.invite`.
  - Body:
    - `userId`: string, required
    - `role`: `GM`, `CO_GM`, `PLAYER`, or `OBSERVER`, required
  - `OWNER` cannot be invited directly. Use ownership transfer.
  - Only `OWNER` can invite `GM` or `CO_GM`.
- `PATCH /api/v1/campaigns/:campaignId/members/:memberId`
  - Changes a member role or transfers ownership when `role` is `OWNER`.
  - Requires `member.change_role`.
  - Body:
    - `role`: `OWNER`, `GM`, `CO_GM`, `PLAYER`, or `OBSERVER`, required
- `DELETE /api/v1/campaigns/:campaignId/members/:memberId`
  - Removes an active campaign member.
  - Requires `member.remove`.

## Campaign Invitations

- `GET /api/v1/campaigns/:campaignId/invitations`
  - Lists campaign invitations.
  - Requires `member.invite`.
- `POST /api/v1/campaigns/:campaignId/invitations/:invitationId/accept`
  - Accepts an invitation.
  - Requires authentication.
  - Only the invited user can accept.
- `POST /api/v1/campaigns/:campaignId/invitations/:invitationId/decline`
  - Declines an invitation.
  - Requires authentication.
  - Only the invited user can decline.

## Campaign Permissions

Campaign access is enforced by the backend. The frontend may use returned campaign `role` values to hide or show UI actions, but it is not a security boundary.

Every campaign-scoped use case must provide `campaignId` explicitly and must verify active campaign membership before returning or mutating campaign data.

Current permission mapping:

| Permission | Roles |
| --- | --- |
| `campaign.read` | `OWNER`, `GM`, `CO_GM`, `PLAYER`, `OBSERVER` |
| `campaign.update` | `OWNER` |
| `campaign.archive` | `OWNER` |
| `member.invite` | `OWNER`, `GM`, `CO_GM` |
| `member.remove` | `OWNER` |
| `member.change_role` | `OWNER` |
| `character.create` | `OWNER`, `GM`, `CO_GM`, `PLAYER` |
| `character.read` | `OWNER`, `GM`, `CO_GM`, `PLAYER`, `OBSERVER` |
| `character.update` | `OWNER`, `GM`, `CO_GM`, `PLAYER` |
| `character.delete` | `OWNER`, `GM`, `CO_GM`, `PLAYER` |
| `npc.create` | `OWNER`, `GM`, `CO_GM` |
| `npc.read_secret` | `OWNER`, `GM`, `CO_GM` |
| `npc.update` | `OWNER`, `GM`, `CO_GM` |
| `note.read_private_gm` | `OWNER`, `GM`, `CO_GM` |
| `note.create_player` | `OWNER`, `GM`, `CO_GM`, `PLAYER` |
| `note.moderate` | `OWNER`, `GM`, `CO_GM` |
| `quest.read_hidden` | `OWNER`, `GM`, `CO_GM` |
| `quest.update` | `OWNER`, `GM`, `CO_GM` |
| `location.read_hidden` | `OWNER`, `GM`, `CO_GM` |
| `location.update` | `OWNER`, `GM`, `CO_GM` |
| `inventory.transfer` | `OWNER`, `GM`, `CO_GM`, `PLAYER` |

## Error Semantics

- `401 Unauthorized`: authentication failure (missing/invalid/expired credentials)
- `403 Forbidden`: authenticated user lacks required permissions
- `404 Not Found`: requested resource does not exist or is not visible to the current user
