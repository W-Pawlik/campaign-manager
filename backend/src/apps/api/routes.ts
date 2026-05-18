import { Router, type RequestHandler } from "express";
import type { HealthController } from "@api/controllers/HealthController";
import type { AuthController } from "@api/controllers/AuthController";
import type { UsersController } from "@api/controllers/users.controller";
import { createHealthRouter } from "@api/routes/health.route";
import { createAuthRouter } from "@api/routes/auth.route";
import { createUsersRouter } from "@api/routes/users.routes";

export interface ApiRoutesOptions {
  healthController: HealthController;
  authController: AuthController;
  usersController: UsersController;
  authMiddleware: RequestHandler;
  registerAdditionalRoutes?: (router: Router) => void;
}

export function createApiRouter(options: ApiRoutesOptions): RequestHandler {
  const router = Router();

  router.use("/health", createHealthRouter(options.healthController));
  router.use("/api/v1/auth", createAuthRouter(options.authController, options.authMiddleware));
  router.use("/api/v1/users", createUsersRouter(options.usersController, options.authMiddleware));

  if (options.registerAdditionalRoutes) {
    options.registerAdditionalRoutes(router);
  }

  return router;
}
