import type { ErrorRequestHandler, RequestHandler } from "express";
import type { Container } from "inversify";
import { HealthController } from "@api/controllers/HealthController";
import { createErrorHandlerMiddleware } from "@api/middlewares/error-handler.middleware";
import { createRequestContextMiddleware } from "@api/middlewares/request-context.middleware";
import { createRequestLoggerMiddleware } from "@api/middlewares/request-logger.middleware";
import { API_TYPES } from "@api/di/api.types";
import type { DatabaseHealthChecker } from "@core/application/database/DatabaseHealthChecker";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { Logger } from "@core/application/logging/Logger";
import { CORE_TYPES } from "@core/di/core.types";
import type { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";

export function loadApiContainerModule(container: Container): void {
  container
    .bind<HealthController>(API_TYPES.HealthController)
    .toDynamicValue((context) => {
      const databaseHealthChecker = context.get<DatabaseHealthChecker>(CORE_TYPES.DatabaseHealthChecker);

      return new HealthController(databaseHealthChecker);
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
    .bind<ErrorRequestHandler>(API_TYPES.ErrorHandlerMiddleware)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(CORE_TYPES.Logger);
      const requestContextStore = context.get<RequestContextStore>(CORE_TYPES.RequestContextStore);
      const errorMapper = context.get<ErrorMapper>(CORE_TYPES.ErrorMapper);

      return createErrorHandlerMiddleware(errorMapper, logger, requestContextStore);
    })
    .inSingletonScope();
}
