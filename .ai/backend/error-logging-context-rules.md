# Backend Error, Logging, and Context Rules

## Error model

Use explicit error classes.

Expected errors include:

```txt
DomainError
ValidationError
NotFoundError
ForbiddenError
ConflictError
ExternalServiceError
InfrastructureError
AppError
```

## Domain and application errors

Domain/application code may throw meaningful errors.

Example:

```ts
throw new ForbiddenError('User cannot invite members');
```

Do not throw raw generic errors for expected business failures when a specific error type exists.

## Global error handling

HTTP error handling belongs in:

```txt
apps/api/middlewares/error-handler.middleware.ts
```

The global error handler should:

- catch known errors
- map them to consistent HTTP responses
- include `requestId` when available
- avoid leaking sensitive internal details
- return safe messages for unknown errors

Example response shape:

```json
{
  "type": "forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "User cannot invite members",
  "requestId": "req_123"
}
```

## ErrorMapper

Use `ErrorMapper` to translate internal errors to HTTP-friendly responses.

Do not duplicate error mapping logic across controllers.

## Controllers and errors

Controllers should not contain large `try/catch` blocks.

Let known errors flow to the global error handler.

Use local `try/catch` only when the controller can add meaningful context or handle a specific case.

## Logger

Use a logger abstraction.

Expected files:

```txt
core/infrastructure/logger/Logger.ts
core/infrastructure/logger/PinoLogger.ts
```

`PinoLogger` should be registered as a singleton.

## What to log

Log useful technical context:

```txt
requestId
correlationId
userId
campaignId
operation name
external integration name
duration
errors
important state transitions
```

## What not to log

Do not log:

```txt
passwords
password hashes
JWT tokens
refresh tokens
full cookies
secrets
API keys
sensitive user data
full presigned URLs
large file contents
```

## RequestContext

Use `RequestContext` for technical request metadata:

```txt
requestId
correlationId
userId
ip
userAgent
```

Expected files:

```txt
core/application/RequestContext.ts
core/application/RequestContextStore.ts
core/infrastructure/context/AsyncLocalStorageRequestContextStore.ts
```

## AsyncLocalStorage

Use `AsyncLocalStorage` to keep request context across async calls.

The implementation belongs in infrastructure.

The application code should depend on `RequestContextStore`, not directly on `AsyncLocalStorage`.

## RequestContext middleware

`request-context.middleware.ts` should run early in the middleware chain.

It should create:

- `requestId`
- `correlationId`
- `ip`
- `userAgent`

If the incoming request has `x-request-id`, use it.

If not, generate a new ID.

If there is no `x-correlation-id`, use `requestId` as `correlationId`.

## Auth and RequestContext

Auth middleware may set:

```txt
userId
```

in `RequestContextStore`.

This is useful for logging.

## Important RequestContext rule

Do not use `RequestContext` as the primary source of business data.

Correct:

```ts
new CreateCampaignCommand({
  ownerId: req.user.id,
  name: req.body.name,
});
```

Incorrect:

```ts
const ownerId = requestContextStore.get()?.userId;
```

inside the handler as the main business input.

Handlers may log with context, but business decisions should use explicit command/query data.

## Logging with context

`PinoLogger` may enrich logs automatically:

```ts
const context = requestContextStore.get();

logger.info({
  ...context,
  ...meta,
}, message);
```

## Rule summary

- Use explicit errors.
- Map errors globally.
- Keep controllers clean.
- Use RequestContext for logging and correlation.
- Do not use RequestContext as business input.
- Log enough to debug.
- Never log secrets or sensitive values.
