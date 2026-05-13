# Backend AGENTS.md

## Backend architecture

The backend is a modular monolith using:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- Redis
- AWS S3
- InversifyJS
- lightweight CQRS
- Domain-Driven Design

## Read before backend changes

Before changing backend code, read:

```txt
../.ai/backend/README.md
```

Then read the relevant rule files for the task.

## Main backend structure

```txt
backend/
  src/
    apps/
      api/
      console-app-app/

    core/

    modules/

  prisma/
  tests/
```

## Mandatory rules

- `apps/api` contains HTTP routes, controllers, schemas, middlewares, and API config.
- `apps/console-app` contains CLI commands and console-app-specific config.
- `core` contains shared technical and architectural building blocks.
- `modules` contain business modules.
- Modules use `domain`, `application`, and `infrastructure` layers.
- Modules must not contain HTTP controllers, HTTP routes, or HTTP schemas.
- Do not import Express into module domain or application layers.
- Do not import Prisma into domain or application layers.
- Do not put business logic in controllers.
- Use commands and queries for use cases.
- Use repositories, ports, and adapters.
- Use DI tokens per area: core, app, and module.
- Do not store handler instances in `CommandBus` or `QueryBus`.
- Register command/query handler tokens, not handler instances.
- Handlers should be stateless and transient.
- Do not rely on `inRequestScope` as an HTTP request scope.
- Use `RequestContext` only for logging and correlation.
- Pass business data explicitly through command/query objects.
- Prefer TS path aliases for non-local imports:
  - `@api/*` -> `src/apps/api/*`
  - `@core/*` -> `src/core/*`
  - `@modules/*` -> `src/modules/*`

## Typical commands

Check `package.json` before running commands.

Common backend commands may be:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If adding behavior, add or update tests.
