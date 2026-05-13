# Backend API Layer Rules

## Location

All HTTP API code belongs in:

```txt
backend/src/apps/api
```

Expected structure:

```txt
apps/api/
  main.ts
  app.ts
  routes.ts

  config/
  controllers/
  routes/
  schemas/
  middlewares/
  di/
```

## API layer responsibilities

The API layer is responsible for:

- Express app setup
- HTTP routing
- controllers
- request validation
- authentication middleware
- authorization middleware
- request context middleware
- request logging middleware
- error handling middleware
- API-specific config

The API layer should not contain business logic.

## Controllers

Controllers should be thin.

A controller may:

- read `req.params`
- read `req.query`
- read `req.body`
- read authenticated user data from request
- create command/query objects
- call `CommandBus` or `QueryBus`
- map result to HTTP response

A controller must not:

- use Prisma directly
- use Redis directly
- use S3 directly
- call external APIs directly
- implement business rules
- create repositories manually
- instantiate handlers manually
- bypass command/query handlers

## Routes

Routes should only connect:

```txt
HTTP method + path
  ↓
middlewares
  ↓
controller method
```

Example route responsibilities:

- attach auth middleware
- attach authorization middleware
- attach validation middleware
- call controller

## Schemas

Use Zod schemas for request validation.

Schemas belong in:

```txt
apps/api/schemas
```

Schemas validate HTTP input.

Do not use API schemas as domain entities.

## Middleware order

The API should generally apply middleware in this order:

```txt
request-context.middleware
request-logger.middleware
security middleware
body parser
cookie parser
routes
error-handler.middleware
```

For protected routes:

```txt
auth.middleware
authorization middleware if needed
validate-request.middleware
controller
```

## RequestContext middleware

`request-context.middleware.ts` should run early.

It initializes:

- requestId
- correlationId
- ip
- userAgent

The auth middleware may later add:

- userId

## Auth middleware

Auth middleware may:

- validate access token
- attach authenticated user data to request
- update `RequestContextStore` with `userId`

Auth middleware must not become a place for business rules.

Campaign permissions should be handled through application/domain services where appropriate.

## Validation middleware

Validation middleware should:

- validate params, query, body, and cookies when needed
- use Zod schemas
- return consistent validation errors
- not contain business logic

## Error handler middleware

Global error handler should:

- catch known application/domain errors
- use `ErrorMapper`
- return consistent error responses
- include `requestId` if available
- avoid leaking sensitive details

Controllers should generally not use large `try/catch` blocks.

## Endpoint naming

Use clear REST-style routes.

Examples:

```txt
/api/v1/auth/register
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/auth/logout

/api/v1/campaigns
/api/v1/campaigns/:campaignId
/api/v1/campaigns/:campaignId/members
/api/v1/campaigns/:campaignId/assets
/api/v1/campaigns/:campaignId/rules/monsters/:slug/import
```

## API rule summary

- Keep HTTP in `apps/api`.
- Keep controllers thin.
- Validate with Zod.
- Use middlewares for cross-cutting HTTP concerns.
- Use commands and queries for use cases.
- Do not put business logic in routes, controllers, or middleware.
- Do not put HTTP code in modules.
