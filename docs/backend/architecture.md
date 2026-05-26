# Backend Architecture

## Architectural Style

Backend is implemented as a modular monolith with DDD-inspired layering and lightweight CQRS.

## Main Structure

```txt
backend/src/
  apps/
    api/
    console-app/
  core/
  modules/
```

## Layer Responsibilities

### apps/api

HTTP boundary only:

- routes
- controllers
- API schemas (Zod)
- middlewares
- API-specific DI/config

### core

Cross-cutting technical foundation:

- command/query buses
- DI container setup
- error mapping
- logger abstractions
- request context
- database/redis clients
- graceful shutdown

### modules

Business capabilities (`auth`, `users`, `campaigns`) split into:

- `domain/`: entities, value objects, business rules
- `application/`: commands, queries, handlers, ports, DTOs
- `infrastructure/`: adapters/repositories (Prisma, etc.)

## Request Flow (API)

```txt
HTTP request
  -> middlewares (context, logger, auth, validation)
  -> controller
  -> CommandBus / QueryBus
  -> handler (resolved by token via DI)
  -> repositories/ports
  -> persistence/infrastructure
```

## CQRS + DI Rules (Implemented)

- buses register handler **tokens**, not instances
- handlers are stateless and transient
- business input is passed explicitly in command/query objects
- infrastructure details stay behind application ports