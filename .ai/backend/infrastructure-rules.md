# Backend Infrastructure Rules

## Purpose

Infrastructure implements technical details behind application ports.

Application and domain layers should not depend on concrete infrastructure.

## Prisma

Prisma is allowed only in infrastructure.

Allowed locations:

```txt
modules/<module>/infrastructure/persistence/
core/infrastructure/database/
```

Do not import Prisma in:

```txt
domain/
application/
apps/api/controllers/
```

Use repositories and mappers.

Example:

```txt
CampaignRepository port
  ↓
PrismaCampaignRepository implementation
  ↓
CampaignMapper
  ↓
Prisma Client
```

## Prisma models vs domain entities

Prisma models are persistence records.

They are not domain entities.

Use mappers to convert:

```txt
Prisma record -> domain entity
domain entity -> persistence data
```

## Read repositories

Read repositories may return DTOs directly.

This is acceptable for query use cases.

Example:

```txt
CampaignReadRepository.getDetails(...)
  → CampaignDetailsDTO
```

## Redis

Redis may be used for:

- Open5e cache
- rate limiting
- BullMQ queues
- temporary tokens
- optional token blacklist

Access Redis through ports where possible.

Example:

```ts
export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
}
```

Implementation:

```txt
core/infrastructure/redis/RedisCache.ts
```

## S3

Files are stored in S3.

Metadata is stored in PostgreSQL.

Use a storage port:

```txt
FileStorage
```

Implementation:

```txt
S3FileStorage
```

Do not use S3 SDK directly in handlers or controllers.

## File upload flow

Expected flow:

```txt
Frontend asks for upload URL
  ↓
Backend checks permissions
  ↓
Backend creates Asset PENDING
  ↓
Backend generates presigned URL
  ↓
Frontend uploads file to S3
  ↓
Frontend confirms upload
  ↓
Backend marks Asset READY
  ↓
Optional OCR/thumbnail queue
```

Do not skip permission checks.

Do not log full presigned URLs.

## Open5e integration

Open5e should be hidden behind a port:

```txt
Open5eClient
```

Implementation:

```txt
Open5eHttpAdapter
Open5eMapper
```

Application code should not depend on Open5e HTTP response shape directly.

Use mappers.

Use Redis cache where useful.

## AI and OCR integrations

AI and OCR providers should be hidden behind ports.

Examples:

```txt
AiProvider
OcrProvider
```

Implementations may include:

```txt
OpenAiAdapter
TextractOcrAdapter
```

Do not couple application code to a specific vendor SDK.

## HTTP client

Use a shared HTTP client abstraction when useful.

Examples:

```txt
HttpClient
AxiosHttpClient
```

External adapters may depend on this abstraction.

## Config

Config files should not create clients.

Correct:

```ts
export const databaseConfig = {
  url: env.DATABASE_URL,
};
```

Incorrect:

```ts
export const prisma = new PrismaClient();
```

Client creation belongs in:

```txt
core/infrastructure/database/prisma.client.ts
core/infrastructure/redis/redis.client.ts
```

## Graceful shutdown

The backend must support graceful shutdown for production usage.

Handle:

```txt
SIGTERM
SIGINT
uncaughtException
unhandledRejection
```

Shutdown should:

- stop accepting new HTTP requests
- close HTTP server
- disconnect Prisma
- quit Redis
- close queues
- flush logger if needed
- exit with correct status code

Use:

```txt
ShutdownHook
ShutdownManager
```

Infrastructure clients that need cleanup should register shutdown hooks.

Examples:

```txt
PrismaShutdownHook
RedisShutdownHook
BullMqShutdownHook
```

## Infrastructure rule summary

- Keep SDKs out of domain and application.
- Put technical details behind ports.
- Use mappers at infrastructure boundaries.
- Use Prisma only in infrastructure.
- Use Redis and S3 through abstractions.
- Config exports values, not clients.
- Add shutdown hooks for long-lived technical resources.
