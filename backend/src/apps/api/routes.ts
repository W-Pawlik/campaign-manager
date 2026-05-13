import { Router, type RequestHandler } from "express";
import type { HealthController } from "@api/controllers/HealthController";
import { createHealthRouter } from "@api/routes/health.route";

export interface ApiRoutesOptions {
  healthController: HealthController;
  registerAdditionalRoutes?: (router: Router) => void;
}

export function createApiRouter(options: ApiRoutesOptions): RequestHandler {
  const router = Router();

  router.use("/health", createHealthRouter(options.healthController));

  if (options.registerAdditionalRoutes) {
    options.registerAdditionalRoutes(router);
  }

  return router;
}
