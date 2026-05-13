# Backend Testing Rules

## Testing strategy

Use tests at different levels:

```txt
unit tests
small integration tests
API integration tests
e2e flow tests
```

## Test locations

Unit tests and small tests should live close to code:

```txt
modules/campaigns/domain/entities/__tests__/Campaign.test.ts
modules/campaigns/application/handlers/__tests__/CreateCampaignHandler.test.ts
modules/auth/domain/value-objects/__tests__/Email.test.ts
```

Larger tests should live in:

```txt
backend/tests/
  integration/
  e2e/
```

## Domain tests

Domain tests should not need infrastructure.

They should test:

- entity behavior
- value object validation
- domain service rules
- domain invariants
- domain events if relevant

Do not use Prisma, Express, Redis, or S3 in domain tests.

## Handler tests

Command/query handler tests should usually mock ports.

Test:

- happy path
- validation/business failures
- repository calls
- returned DTO/result
- important logging if relevant
- transaction behavior if relevant

Do not use real Prisma unless it is explicitly an integration test.

## Application service tests

Application service tests should verify orchestration.

Test:

- repository calls
- permission checks
- domain service usage
- error cases

## Repository tests

Repository tests are integration tests.

They may use:

- test database
- Prisma
- migrations/seed setup

They should not be mixed with pure unit tests.

## API tests

Use Supertest or equivalent for API integration tests.

Test:

- status code
- response body
- validation errors
- auth behavior
- permission behavior
- global error response shape

API tests should verify the HTTP boundary, not every internal implementation detail.

## E2E flow tests

Use e2e tests for important user flows.

Examples:

```txt
auth-flow.e2e.test.ts
campaign-flow.e2e.test.ts
asset-upload-flow.e2e.test.ts
```

E2E tests should be fewer and focused.

## What to test when adding a command

Add tests for:

- command handler happy path
- expected business errors
- repository interactions
- relevant domain rules
- handler registration if useful

## What to test when adding a query

Add tests for:

- query handler result
- access rules
- missing data behavior
- read repository interactions

## What to test when adding an endpoint

Add tests for:

- valid request
- invalid request body/params/query
- unauthenticated request if protected
- unauthorized request if role-based
- expected response shape
- error response shape

## Test rules

- Prefer fast unit tests for domain and handlers.
- Use integration tests for Prisma and API.
- Keep tests deterministic.
- Do not depend on external APIs in normal tests.
- Mock Open5e, AI, OCR, S3, and external HTTP services.
- Do not use production environment variables in tests.
- Do not leak test state between tests.

## Before finishing backend work

Run available checks from `backend/package.json`.

Common commands may include:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If a command does not exist, do not invent it.
