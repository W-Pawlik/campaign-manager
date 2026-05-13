# Backend System Design Rules

## Goal

The backend should be a clean, testable, modular monolith.

It should not become a flat Express CRUD application.

## Main architecture

The backend uses:

- modular monolith
- Domain-Driven Design
- lightweight CQRS
- Dependency Injection with InversifyJS
- repository pattern
- adapter pattern
- mapper pattern
- global error handling
- contextual logging
- graceful shutdown

## Backend structure

```txt
backend/
  src/
    apps/
      api/
      console-app/

    core/

    modules/

  prisma/
  tests/
```

## `apps`

`apps` contains executable applications.

### `apps/api`

Contains HTTP-specific code:

- Express app setup
- routes
- controllers
- schemas
- middlewares
- API config
- API DI module

### `apps/console-app`

Contains console-app/CLI-specific code:

- seed command
- create admin command
- import commands
- console-app config
- console-app DI module

## `core`

`core` contains shared backend building blocks.

Allowed examples:

- config
- base domain classes
- common errors
- `CommandBus`
- `QueryBus`
- `HandlerResolver`
- `RequestContext`
- `ShutdownManager`
- logger abstraction
- Prisma client factory
- Redis client factory
- S3 file storage abstraction
- HTTP client abstraction
- transaction manager
- shared utilities

`core` must not depend on specific business modules.

## `modules`

`modules` contain business capabilities.

Examples:

- `auth`
- `users`
- `campaigns`
- `characters`
- `sessions`
- `notes`
- `assets`
- `rules-compendium`
- `integrations/open5e`
- `integrations/ai`
- `integrations/ocr`

Each larger module should use:

```txt
domain/
application/
infrastructure/
```

## Dependency direction

Allowed:

```txt
apps/api -> core
apps/api -> modules

apps/console-app -> core
apps/console-app -> modules

modules/application -> modules/domain
modules/application -> application ports

modules/infrastructure -> modules/application ports
modules/infrastructure -> core/infrastructure

core/infrastructure -> core/application
```

Not allowed:

```txt
domain -> infrastructure
domain -> Express
domain -> Prisma
domain -> Redis
domain -> S3
domain -> JWT
domain -> Open5e
domain -> Inversify

application -> Express
application -> Prisma
application -> concrete external SDKs
core -> concrete business modules
```

## HTTP boundary

HTTP code belongs only in:

```txt
backend/src/apps/api
```

Do not create HTTP `interfaces` folders inside modules.

Modules should not contain:

- controllers
- HTTP routes
- Express request handlers
- Zod schemas for HTTP requests

## Config rules

Use three config areas:

```txt
core/config
apps/api/config
apps/console-app/config
```

`core/config` is for shared backend config:

- database
- Redis
- AWS
- auth
- Open5e
- logger

`apps/api/config` is for HTTP API config:

- port
- CORS
- cookies
- body limit
- HTTP settings

`apps/console-app/config` is for CLI-specific config.

Config files should:

- read environment variables
- validate environment variables
- export plain config objects

Config files should not:

- create Prisma clients
- create Redis clients
- create S3 clients
- perform side effects

## Import aliases

Use TypeScript path aliases instead of long relative imports.

Backend aliases:

- `@api/*` -> `src/apps/api/*`
- `@core/*` -> `src/core/*`
- `@modules/*` -> `src/modules/*`

Use aliases for cross-folder imports. Keep `./` imports for local files in the same feature folder when it is clearer.

## High-level request flow

```txt
HTTP request
  ↓
request-context.middleware
  ↓
request-logger.middleware
  ↓
auth.middleware
  ↓
validate-request.middleware
  ↓
controller
  ↓
CommandBus / QueryBus
  ↓
HandlerResolver
  ↓
Inversify container.get(handlerToken)
  ↓
handler
  ↓
application services / domain
  ↓
ports
  ↓
infrastructure adapters
  ↓
PostgreSQL / Redis / S3 / Open5e / AI / OCR
```

## High-level CLI flow

```txt
console-app command
  ↓
apps/console-app
  ↓
CommandBus / QueryBus
  ↓
handler
  ↓
application services / domain
  ↓
ports
  ↓
infrastructure adapters
```

## Main system rules

- Keep controllers thin.
- Keep domain independent.
- Keep application layer focused on use cases.
- Keep infrastructure behind ports.
- Keep external systems behind adapters.
- Keep config side-effect free.
- Keep handlers stateless.
- Keep request data explicit in commands and queries.
