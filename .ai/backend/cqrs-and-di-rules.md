# Backend CQRS and DI Rules

## CQRS style

The backend uses lightweight CQRS.

This means:

```txt
Command
CommandHandler
CommandBus

Query
QueryHandler
QueryBus
```

There are no separate write/read databases and no event sourcing unless explicitly added later.

## Commands

A command represents an intent to change system state.

Examples:

```txt
RegisterUserCommand
LoginUserCommand
RefreshTokenCommand
LogoutCommand
CreateCampaignCommand
UpdateCampaignCommand
DeleteCampaignCommand
InviteCampaignMemberCommand
UploadAssetCommand
ImportMonsterFromOpen5eCommand
```

Commands should be simple data objects.

Commands should contain explicit business data needed by the use case.

Do not rely on `RequestContext` as the source of business input.

## Command handlers

A command handler executes one command.

Handlers may:

- load domain entities
- call repositories
- call application services
- call domain services
- use transaction manager
- use ports
- save changes
- log relevant technical information

Handlers should be stateless.

Handlers should not store request-specific data in class fields.

## Queries

A query represents an intent to read data.

Examples:

```txt
GetCurrentUserQuery
GetCampaignDetailsQuery
ListUserCampaignsQuery
ListCampaignMembersQuery
SearchMonstersQuery
GetAssetDownloadUrlQuery
```

Queries must not change system state.

## Query handlers

Query handlers execute read use cases.

They may use read repositories.

They may return DTOs directly.

They do not need to construct full domain entities when returning read-optimized views.

## CommandBus and QueryBus

`CommandBus` and `QueryBus` are singletons.

They must not store handler instances.

They must store:

```txt
Command/Query name -> handler token
```

Correct:

```ts
commandBus.register(
  CreateCampaignCommand.name,
  CAMPAIGNS_TYPES.CreateCampaignHandler,
);
```

Incorrect:

```ts
commandBus.register(
  CreateCampaignCommand.name,
  container.get(CAMPAIGNS_TYPES.CreateCampaignHandler),
);
```

The incorrect version creates and stores a handler instance too early.

## HandlerResolver

Buses use `HandlerResolver`.

`HandlerResolver` is an application-level abstraction:

```ts
export interface HandlerResolver {
  resolve<T>(token: symbol): T;
}
```

The Inversify-specific implementation belongs in infrastructure:

```txt
core/infrastructure/di/InversifyHandlerResolver.ts
```

This keeps `core/application` independent from Inversify.

## Handler registration

Each module registers its own handlers in:

```txt
modules/<module>/<module>.handlers.ts
```

Example:

```ts
export function registerCampaignsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(
    CreateCampaignCommand.name,
    CAMPAIGNS_TYPES.CreateCampaignHandler,
  );

  queryBus.register(
    GetCampaignDetailsQuery.name,
    CAMPAIGNS_TYPES.GetCampaignDetailsHandler,
  );
}
```

Important:

- Register tokens.
- Do not resolve handlers during registration.
- Do not call `container.get(handlerToken)` during registration.

## Global handler registration

`core/di/register-handlers.ts` should only coordinate module registrations.

Example:

```ts
export function registerHandlers(container: Container): void {
  registerAuthHandlers(container);
  registerCampaignsHandlers(container);
  registerAssetsHandlers(container);
  registerRulesCompendiumHandlers(container);
}
```

## DI token structure

Use separate token files.

Examples:

```txt
core/di/core.types.ts
apps/api/di/api.types.ts
apps/console-app/di/console-app.types.ts
modules/campaigns/campaigns.types.ts
modules/auth/auth.types.ts
modules/assets/assets.types.ts
modules/integrations/open5e/open5e.types.ts
```

Do not create one huge global `types.ts` for all backend tokens.

## Core tokens

Core tokens may include:

```txt
Logger
PrismaClient
RedisClient
Cache
FileStorage
CommandBus
QueryBus
HandlerResolver
RequestContextStore
ShutdownManager
TransactionManager
IdGenerator
```

## Module tokens

Module tokens should include only dependencies owned by that module.

Examples for campaigns:

```txt
CampaignRepository
CampaignReadRepository
CampaignInvitationRepository
CampaignPermissionDomainService
CampaignAccessApplicationService
CreateCampaignHandler
GetCampaignDetailsHandler
```

## Container modules

Each module should have:

```txt
<module>.container-module.ts
```

It should bind:

- repositories
- read repositories
- handlers
- domain services
- application services
- adapters
- mappers
- factories

## Scope rules

Use singleton for:

```txt
PrismaClient
RedisClient
Logger
CommandBus
QueryBus
RequestContextStore
ShutdownManager
config
```

Use transient for:

```txt
Command handlers
Query handlers
Controllers
Application services
Most adapters that do not own expensive connections
```

Use singleton or transient for stateless:

```txt
Domain services
Mappers
Factories
```

## Important Inversify rule

Do not rely on `inRequestScope` as an HTTP request scope.

Inversify request scope is related to a single dependency resolution plan, not automatically to one Express request.

Use this rule instead:

```txt
Handlers are stateless.
Request data is passed explicitly through commands/queries.
RequestContext is used for logging and correlation.
```

## DI rule summary

- Buses are singletons.
- Buses store tokens, not instances.
- Handlers are transient and stateless.
- HandlerResolver hides Inversify from application core.
- Tokens are split per core/app/module.
- Modules bind their own dependencies.
- Modules register their own handler tokens.
