import { Router, type RequestHandler } from "express";
import type { HealthController } from "@api/controllers/HealthController";
import type { AuthController } from "@api/controllers/AuthController";
import type { UsersController } from "@api/controllers/users.controller";
import type { CampaignCharactersController } from "@api/controllers/CampaignCharactersController";
import type { CampaignMembersController } from "@api/controllers/CampaignMembersController";
import type { CampaignNpcsController } from "@api/controllers/CampaignNpcsController";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import { createHealthRouter } from "@api/routes/health.route";
import { createAuthRouter } from "@api/routes/auth.route";
import { createUsersRouter } from "@api/routes/users.routes";
import { createCampaignsRouter } from "@api/routes/campaigns.routes";

export interface ApiRoutesOptions {
  healthController: HealthController;
  authController: AuthController;
  usersController: UsersController;
  campaignsController: CampaignsController;
  campaignMembersController: CampaignMembersController;
  campaignCharactersController: CampaignCharactersController;
  campaignNpcsController: CampaignNpcsController;
  authMiddleware: RequestHandler;
  registerAdditionalRoutes?: (router: Router) => void;
}

export function createApiRouter(options: ApiRoutesOptions): RequestHandler {
  const router = Router();

  router.use("/health", createHealthRouter(options.healthController));
  router.use("/api/v1/auth", createAuthRouter(options.authController, options.authMiddleware));
  router.use("/api/v1/users", createUsersRouter(options.usersController, options.authMiddleware));
  router.use(
    "/api/v1/campaigns",
    createCampaignsRouter(
      options.campaignsController,
      options.campaignMembersController,
      options.campaignCharactersController,
      options.campaignNpcsController,
      options.authMiddleware,
    ),
  );

  if (options.registerAdditionalRoutes) {
    options.registerAdditionalRoutes(router);
  }

  return router;
}
