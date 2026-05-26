import type { ErrorRequestHandler, RequestHandler, Router } from "express";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { Container } from "inversify";
import { apiConfig } from "@api/config/api.config";
import { API_TYPES } from "@api/di/api.types";
import { createApiRouter } from "@api/routes";
import type { HealthController } from "@api/controllers/HealthController";
import type { AuthController } from "@api/controllers/AuthController";
import type { UsersController } from "@api/controllers/users.controller";
import type { CampaignsController } from "@api/controllers/CampaignsController";

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
  const authMiddleware = options.container.get<RequestHandler>(API_TYPES.AuthMiddleware);
  const healthController = options.container.get<HealthController>(API_TYPES.HealthController);
  const authController = options.container.get<AuthController>(API_TYPES.AuthController);
  const usersController = options.container.get<UsersController>(API_TYPES.UsersController);
  const campaignsController = options.container.get<CampaignsController>(API_TYPES.CampaignsController);

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
      authController,
      usersController,
      campaignsController,
      authMiddleware,
      ...routesOptions,
    }),
  );

  app.use(errorHandlerMiddleware);

  return app;
}