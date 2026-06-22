# Postman Collections

Postman files are split by purpose.

## Structure

```txt
postman/
  campaign-manager-local.environment.json

  modules/
    health.collection.json
    auth.collection.json
    users.collection.json
    campaigns.collection.json
    campaign-members.collection.json
    monsters.collection.json
    external-open5e.collection.json

  flows/
    auth-flow.collection.json
    campaign-flow.collection.json
    campaign-members-flow.collection.json
```

## Maintenance Rules

- Add or update single-endpoint requests in `modules/<module>.collection.json`.
- Add cross-module scenarios in `flows/*.collection.json`.
- Keep shared environment values minimal. `baseUrl` belongs in the environment.
- Keep runtime IDs and tokens as collection variables, especially in flows.
- If a module endpoint depends on another module, document the required variables in that module collection and add a runnable scenario in `flows/`.
- Avoid rebuilding one giant collection. Flows are allowed to be sequential; module collections should stay easy to edit manually.

## Current Coverage

- `modules/campaigns.collection.json` covers campaign CRUD, cover image upload and owner-only campaign actions.
- `modules/campaign-members.collection.json` covers member listing, invitations, role changes, removal and ownership transfer.
- `modules/monsters.collection.json` covers campaign monster listing, custom creation, Open5e import, details, updates and archiving.
- `modules/external-open5e.collection.json` covers authenticated Open5e search and cached details lookup.
- `flows/campaign-flow.collection.json` covers an owner-driven campaign lifecycle including soft deletion visibility.
- `flows/campaign-members-flow.collection.json` covers invitation lifecycle, member removal, reinvitation and ownership transfer.

