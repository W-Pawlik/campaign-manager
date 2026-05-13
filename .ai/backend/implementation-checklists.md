# Backend Implementation Checklists

Use these checklists when implementing common backend tasks.

They are intentionally practical and should be followed together with the rule files.

---

## Add a new backend module

1. Create module folder:

```txt
modules/<module>/
```

2. Add module DI files:

```txt
<module>.types.ts
<module>.container-module.ts
<module>.handlers.ts
```

3. Add layer folders:

```txt
domain/
application/
infrastructure/
```

4. Add only the folders that are needed immediately.

5. Register the module container in:

```txt
core/di/container.ts
```

6. Register module handlers in:

```txt
core/di/register-handlers.ts
```

7. Keep HTTP code out of the module.

8. Add tests for domain/application behavior.

---

## Add a new command

1. Create command:

```txt
modules/<module>/application/commands/<CommandName>.ts
```

2. Create handler:

```txt
modules/<module>/application/handlers/<CommandName>Handler.ts
```

3. Add or reuse required ports:

```txt
modules/<module>/application/ports/
```

4. Add domain logic if needed:

```txt
modules/<module>/domain/
```

5. Add infrastructure implementation if needed:

```txt
modules/<module>/infrastructure/
```

6. Add handler token:

```txt
modules/<module>/<module>.types.ts
```

7. Bind handler as transient:

```txt
modules/<module>/<module>.container-module.ts
```

8. Register command name to handler token:

```txt
modules/<module>/<module>.handlers.ts
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

9. Add tests for the handler.

---

## Add a new query

1. Create query:

```txt
modules/<module>/application/queries/<QueryName>.ts
```

2. Create query handler:

```txt
modules/<module>/application/handlers/<QueryName>Handler.ts
```

3. Create DTO if needed:

```txt
modules/<module>/application/dto/
```

4. Add read repository port if needed:

```txt
modules/<module>/application/ports/
```

5. Implement read repository in infrastructure if needed.

6. Add handler token.

7. Bind handler as transient.

8. Register query name to handler token.

9. Add tests.

---

## Add a new API endpoint

1. Add or update schema:

```txt
apps/api/schemas/
```

2. Add or update controller method:

```txt
apps/api/controllers/
```

3. Controller should create a command or query.

4. Controller should call:

```txt
CommandBus
```

or:

```txt
QueryBus
```

5. Add or update route:

```txt
apps/api/routes/
```

6. Attach middlewares:

```txt
auth.middleware
authorization middleware if needed
validate-request.middleware
```

7. Register route in:

```txt
apps/api/routes.ts
```

8. Do not put business logic in controller or route.

9. Add API tests.

---

## Add Prisma persistence

1. Add or update Prisma schema:

```txt
backend/prisma/schema.prisma
```

2. Add migration.

3. Create or update repository port in application layer.

4. Create Prisma repository implementation:

```txt
modules/<module>/infrastructure/persistence/
```

5. Create or update mapper:

```txt
<Module>Mapper.ts
```

6. Bind repository implementation in module container.

7. Do not expose Prisma models to domain/application.

8. Add repository integration tests if needed.

---

## Add an external integration

1. Define a port in application layer.

Example:

```txt
Open5eClient
AiProvider
OcrProvider
```

2. Implement adapter in infrastructure.

3. Add mapper for external response shape.

4. Add config in `core/config` if shared.

5. Add DI token in module/integration types file.

6. Bind adapter in container module.

7. Add timeout/retry/cache behavior if appropriate.

8. Mock external integration in tests.

9. Do not call vendor SDKs directly from handlers or controllers.

---

## Add file upload support

1. Define or reuse `FileStorage` port.

2. Use S3 implementation behind the port.

3. Store file metadata in PostgreSQL.

4. Use asset status flow:

```txt
PENDING
READY
FAILED
```

5. Generate presigned URL only after permission checks.

6. Do not log full presigned URLs.

7. Confirm upload before marking asset as ready.

8. Add optional queue job for OCR/thumbnail processing if needed.

9. Add tests for permission and status transitions.

---

## Add RequestContext usage

1. Use `RequestContextStore` abstraction.

2. Do not import `AsyncLocalStorage` outside infrastructure.

3. Initialize context in API middleware.

4. Add `userId` in auth middleware after authentication.

5. Use context for logging and correlation.

6. Do not use context as main business input.

---

## Add graceful shutdown support for a resource

1. Create a shutdown hook implementing:

```txt
ShutdownHook
```

2. Register the hook with:

```txt
ShutdownManager
```

3. Ensure the hook safely closes the resource.

4. Handle repeated shutdown calls defensively if needed.

5. Log shutdown failures.

---

## Add tests for a new use case

1. Test domain rules if changed.

2. Test command/query handler.

3. Mock ports for handler tests.

4. Add API test if exposed over HTTP.

5. Add integration test if database behavior matters.

6. Add e2e test only for important user flows.

---

## Final backend checklist before completing work

- Layer boundaries are respected.
- No Prisma import in domain/application.
- No Express import in modules.
- No business logic in controllers.
- Command/query data is explicit.
- Handler is stateless.
- Handler is registered by token, not instance.
- DI token is in the correct local types file.
- Tests are added or updated.
- Available typecheck/lint/test/build commands pass or failures are reported.
