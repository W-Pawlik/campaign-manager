import { Router, type RequestHandler } from "express";
import type { HealthController } from "@api/controllers/HealthController";
import type { AuthController } from "@api/controllers/AuthController";
import { createHealthRouter } from "@api/routes/health.route";
import { createAuthRouter } from "@api/routes/auth.route";

export interface ApiRoutesOptions {
  healthController: HealthController;
  authController: AuthController;
  authMiddleware: RequestHandler;
  registerAdditionalRoutes?: (router: Router) => void;
}

export function createApiRouter(options: ApiRoutesOptions): RequestHandler {
  const router = Router();

  router.use("/health", createHealthRouter(options.healthController));
  router.use("/api/v1/auth", createAuthRouter(options.authController, options.authMiddleware));

  if (options.registerAdditionalRoutes) {
    options.registerAdditionalRoutes(router);
  }

  return router;
}
