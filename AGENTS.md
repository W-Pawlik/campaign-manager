# AGENTS.md

## Project

This repository contains **Campaign Manager**, a fullstack application for managing tabletop RPG campaigns.

## Repository structure

```txt
campaign-manager/
  frontend/
  backend/
  infra/

  .ai/
    backend/

  AGENTS.md
```

## Main technologies

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- Redis
- AWS S3
- InversifyJS
- Zod
- Pino
- Docker

## Backend architecture

The backend follows:

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

## Instruction system

Detailed AI coding instructions are stored in:

```txt
.ai/
```

For backend work, read:

```txt
backend/AGENTS.md
.ai/backend/README.md
```

The backend instruction files are authoritative for backend implementation.

For frontend work, read:

```txt
frontend/AGENTS.md
```

Frontend-specific detailed instructions are not finalized yet.

## General rules for coding agents

Before making changes:

1. Identify whether the task affects backend, frontend, infra, or documentation.
2. Read the relevant local `AGENTS.md`.
3. Read the relevant instruction files in `.ai/`.
4. Follow the existing architecture.
5. Prefer small, focused changes.
6. Do not introduce new architectural patterns without updating the instructions.
7. Do not bypass established layers.
8. Add or update tests when behavior changes.
9. Keep naming consistent with the existing structure.

## Important backend rules

When working on backend code:

- Do not put HTTP routes, controllers, or schemas inside backend modules.
- Keep HTTP code inside `backend/src/apps/api`.
- Keep domain code independent from Express, Prisma, Redis, S3, JWT, Open5e, AI, OCR, and Inversify.
- Do not import Prisma in domain or application layers.
- Do not put business logic in controllers.
- Use commands and queries for application use cases.
- Use `CommandBus` and `QueryBus`.
- Buses must register handler tokens, not handler instances.
- Handlers should be stateless and transient.
- Do not rely on Inversify `inRequestScope` as an HTTP request scope.
- Pass business request data explicitly through command/query objects.
- Use `RequestContext` only for logging, correlation, diagnostics, and technical audit data.

## Validation commands

Use the appropriate project commands before finishing work.

Typical backend checks may include:

```bash
cd backend
npm run typecheck
npm run lint
npm test
npm run build
```

Typical frontend checks may include:

```bash
cd frontend
npm run typecheck
npm run lint
npm test
npm run build
```

If a command is not available, do not invent it. Check `package.json`.
