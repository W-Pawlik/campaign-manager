import type { ErrorRequestHandler, RequestHandler } from "express";
import type { Container } from "inversify";
import { AuthController } from "@api/controllers/AuthController";
import { HealthController } from "@api/controllers/HealthController";
import { UsersController } from "@api/controllers/users.controller";
import { createAuthMiddleware } from "@api/middlewares/auth.middleware";
import { createErrorHandlerMiddleware } from "@api/middlewares/error-handler.middleware";
import { createRequestContextMiddleware } from "@api/middlewares/request-context.middleware";
import { createRequestLoggerMiddleware } from "@api/middlewares/request-logger.middleware";
import { API_TYPES } from "@api/di/api.types";
import type { DatabaseHealthChecker } from "@core/application/database/DatabaseHealthChecker";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { Logger } from "@core/application/logging/Logger";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import type { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";
import type { TokenService } from "@modules/auth/application/ports/TokenService";
import { AUTH_TYPES } from "@modules/auth/auth.types";

export function loadApiContainerModule(container: Container): void {
  container
    .bind<HealthController>(API_TYPES.HealthController)
    .toDynamicValue((context) => {
      const databaseHealthChecker = context.get<DatabaseHealthChecker>(CORE_TYPES.DatabaseHealthChecker);

      return new HealthController(databaseHealthChecker);
    })
    .inTransientScope();
  container
    .bind<AuthController>(API_TYPES.AuthController)
    .toDynamicValue((context) => {
      const commandBus = context.get<CommandBus>(CORE_TYPES.CommandBus);
      const queryBus = context.get<QueryBus>(CORE_TYPES.QueryBus);

      return new AuthController(commandBus, queryBus);
    })
    .inTransientScope();
  container
    .bind<UsersController>(API_TYPES.UsersController)
    .toDynamicValue((context) => {
      const commandBus = context.get<CommandBus>(CORE_TYPES.CommandBus);
      const queryBus = context.get<QueryBus>(CORE_TYPES.QueryBus);

      return new UsersController(commandBus, queryBus);
    })
    .inTransientScope();

  container
    .bind<RequestHandler>(API_TYPES.RequestContextMiddleware)
    .toDynamicValue((context) => {
      const requestContextStore = context.get<RequestContextStore>(CORE_TYPES.RequestContextStore);

      return createRequestContextMiddleware(requestContextStore);
    })
    .inSingletonScope();

  container
    .bind<RequestHandler>(API_TYPES.RequestLoggerMiddleware)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(CORE_TYPES.Logger);

      return createRequestLoggerMiddleware(logger);
    })
    .inSingletonScope();
  container
    .bind<RequestHandler>(API_TYPES.AuthMiddleware)
    .toDynamicValue((context) => {
      const tokenService = context.get<TokenService>(AUTH_TYPES.TokenService);
      const requestContextStore = context.get<RequestContextStore>(CORE_TYPES.RequestContextStore);

      return createAuthMiddleware(tokenService, requestContextStore);
    })
    .inSingletonScope();

  container
    .bind<ErrorRequestHandler>(API_TYPES.ErrorHandlerMiddleware)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(CORE_TYPES.Logger);
      const requestContextStore = context.get<RequestContextStore>(CORE_TYPES.RequestContextStore);
      const errorMapper = context.get<ErrorMapper>(CORE_TYPES.ErrorMapper);

      return createErrorHandlerMiddleware(errorMapper, logger, requestContextStore);
    })
    .inSingletonScope();
}
