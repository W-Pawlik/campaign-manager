# Characters Backend Change Suggestions

## Owner assignment by email

Requested frontend behavior:
- assign character owner by email instead of raw `ownerUserId`
- optionally show suggestions for known user emails

Current backend/API limitation:
- character create and update use `ownerUserId`
- frontend campaign member payloads expose `userId` but not email
- there is no endpoint for resolving email to assignable campaign member

Suggested backend options:
- accept `ownerEmail` in character create/update commands and resolve it server-side
- or add a campaign member lookup endpoint returning assignable users with `id` and `email`
- or enrich existing campaign members payload with safe email data when the caller has enough permissions
