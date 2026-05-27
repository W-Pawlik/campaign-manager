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

