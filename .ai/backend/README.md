# Backend Instructions

This directory contains backend implementation rules for AI coding agents.

The backend is designed as a production-oriented modular monolith using DDD, lightweight CQRS, and Dependency Injection.

## Read this first

For any backend task, first understand the relevant files:

```txt
system-design-rules.md
module-design-rules.md
api-layer-rules.md
cqrs-and-di-rules.md
infrastructure-rules.md
error-logging-context-rules.md
testing-rules.md
implementation-checklists.md
```

## Which file to read

### General architecture

Read:

```txt
system-design-rules.md
```

Use it for:

- backend structure
- app/core/module separation
- dependency direction
- high-level request flow
- config placement
- architectural boundaries

### Module implementation

Read:

```txt
module-design-rules.md
```

Use it for:

- domain entities
- value objects
- domain services
- application services
- ports
- repositories
- DTOs
- mappers
- module boundaries

### HTTP API work

Read:

```txt
api-layer-rules.md
```

Use it for:

- routes
- controllers
- schemas
- middlewares
- request validation
- endpoint structure

### Commands, queries, and DI

Read:

```txt
cqrs-and-di-rules.md
```

Use it for:

- commands
- queries
- handlers
- buses
- handler registration
- DI tokens
- container modules
- scopes

### Infrastructure work

Read:

```txt
infrastructure-rules.md
```

Use it for:

- Prisma
- Redis
- S3
- Open5e
- AI
- OCR
- external adapters
- technical clients
- graceful shutdown

### Errors, logging, and request context

Read:

```txt
error-logging-context-rules.md
```

Use it for:

- domain errors
- application errors
- global error handling
- Pino logging
- RequestContext
- requestId/correlationId

### Testing

Read:

```txt
testing-rules.md
```

Use it for:

- unit tests
- integration tests
- e2e tests
- handler tests
- API tests

### Repeated implementation tasks

Read:

```txt
implementation-checklists.md
```

Use it when adding:

- modules
- commands
- queries
- endpoints
- repositories
- integrations
- tests

## Core principle

Keep the architecture clean.

Do not take shortcuts that break layer boundaries.
