import type { ErrorRequestHandler, RequestHandler, Router } from "express";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { Container } from "inversify";
import { apiConfig } from "@api/config/api.config";
import { API_TYPES } from "@api/di/api.types";
import { createApiRouter } from "@api/routes";
import type { HealthController } from "@api/controllers/HealthController";

export interface CreateApiAppOptions {
  container: Container;
  registerAdditionalRoutes?: (router: Router) => void;
}

export function createApiApp(options: CreateApiAppOptions): Express {
  const app = express();
  const requestContextMiddleware = options.container.get<RequestHandler>(
    API_TYPES.RequestContextMiddleware,
  );
  const requestLoggerMiddleware = options.container.get<RequestHandler>(API_TYPES.RequestLoggerMiddleware);
  const errorHandlerMiddleware = options.container.get<ErrorRequestHandler>(API_TYPES.ErrorHandlerMiddleware);
  const healthController = options.container.get<HealthController>(API_TYPES.HealthController);

  const corsOrigin =
    apiConfig.corsOrigin === "*"
      ? true
      : apiConfig.corsOrigin.split(",").map((origin) => origin.trim());

  app.use(requestContextMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  const routesOptions =
    options.registerAdditionalRoutes === undefined
      ? {}
      : { registerAdditionalRoutes: options.registerAdditionalRoutes };

  app.use(
    createApiRouter({
      healthController,
      ...routesOptions,
    }),
  );

  app.use(errorHandlerMiddleware);

  return app;
}
