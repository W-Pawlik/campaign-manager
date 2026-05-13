# Backend Module Design Rules

## Standard module structure

A business module should usually look like this:

```txt
modules/<module>/
  <module>.types.ts
  <module>.container-module.ts
  <module>.handlers.ts

  domain/
    entities/
    value-objects/
    services/
    events/

  application/
    commands/
    queries/
    handlers/
    ports/
    services/
    dto/

  infrastructure/
    persistence/
```

Some small modules may not need every folder immediately, but do not break the architectural direction.

## Domain layer

The domain layer contains business concepts and rules.

Allowed:

- entities
- aggregate roots
- value objects
- domain services
- domain events
- domain errors
- pure business rules

Not allowed:

- Express
- Prisma
- Redis
- S3
- JWT
- Open5e
- AI SDKs
- OCR SDKs
- Inversify
- HTTP request/response types
- database models

## Entities

Entities represent domain objects with identity.

Examples:

```txt
Campaign
CampaignMember
CampaignInvitation
RefreshToken
UserCredentials
```

Entities should protect invariants and expose meaningful behavior.

Avoid anemic domain objects when rules clearly belong in the domain.

## Value objects

Value objects represent typed, validated values.

Examples:

```txt
Email
PasswordHash
CampaignName
CampaignRole
```

Value objects should be immutable.

Use them to avoid spreading primitive string/number rules across the codebase.

## Domain services

Use domain services for pure business rules that do not naturally belong to a single entity.

Example:

```txt
CampaignPermissionDomainService
```

Domain services may answer questions like:

- can this role invite members?
- can this role delete a campaign?
- can this role change another member's role?

Domain services must not call repositories, external APIs, or infrastructure.

## Application layer

The application layer coordinates use cases.

Allowed:

- commands
- queries
- handlers
- ports
- DTOs
- application services
- transaction manager abstraction
- domain services
- repositories as ports

Not allowed:

- Express request/response types
- Prisma client
- Redis client
- S3 client
- external SDKs directly
- HTTP controllers

## Application services

Use application services to coordinate use cases or shared application-level workflows.

They may use:

- repositories
- read repositories
- transaction manager
- event bus
- cache port
- external service ports
- domain services

Example:

```txt
CampaignAccessApplicationService
```

Application services may check membership, load roles, and call domain services.

## Ports

Ports are interfaces owned by the application layer.

Examples:

```txt
CampaignRepository
CampaignReadRepository
CampaignInvitationRepository
PasswordHasher
TokenService
Open5eClient
FileStorage
Cache
```

Application code depends on ports, not concrete implementations.

## DTOs

DTOs are data structures returned by application/query flows.

Examples:

```txt
CampaignDetailsDTO
CampaignListItemDTO
CampaignMemberDTO
CurrentUserDTO
AuthTokensDTO
```

DTOs are not domain entities.

Read repositories may return DTOs directly when appropriate.

## Infrastructure layer

The infrastructure layer implements application ports.

Allowed:

- Prisma repositories
- Redis adapters
- S3 adapters
- Open5e HTTP adapter
- AI provider adapter
- OCR adapter
- mappers
- external SDK usage

Examples:

```txt
PrismaCampaignRepository
PrismaCampaignReadRepository
Open5eHttpAdapter
S3FileStorage
RedisCache
JwtTokenService
BcryptPasswordHasher
```

## Mappers

Use mappers to translate between layers.

Examples:

```txt
CampaignMapper
AuthMapper
Open5eMapper
AssetMapper
UserMapper
```

Use mappers when converting:

```txt
Prisma record -> domain entity
domain entity -> persistence data
external API response -> internal DTO/entity
domain entity -> DTO
```

## Module-level DI files

Each module should have:

```txt
<module>.types.ts
<module>.container-module.ts
<module>.handlers.ts
```

### `<module>.types.ts`

Contains DI tokens for that module.

### `<module>.container-module.ts`

Binds repositories, services, handlers, mappers, factories, and adapters.

### `<module>.handlers.ts`

Registers command/query names to handler tokens.

It must not resolve handler instances during registration.

## Module rules

- Keep modules autonomous.
- Do not put HTTP code inside modules.
- Do not leak infrastructure into domain.
- Do not leak Prisma types into application or domain.
- Do not use `RequestContext` as business input.
- Pass business data explicitly through command/query objects.
- Prefer ports for dependencies outside the use case.
- Prefer mappers at boundaries.
