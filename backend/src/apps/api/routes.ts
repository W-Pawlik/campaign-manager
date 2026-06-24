import { Router, type RequestHandler } from "express";
import type { HealthController } from "@api/controllers/HealthController";
import type { AuthController } from "@api/controllers/AuthController";
import type { UsersController } from "@api/controllers/users.controller";
import type { CampaignCharactersController } from "@api/controllers/CampaignCharactersController";
import type { CampaignChronicleController } from "@api/controllers/CampaignChronicleController";
import type { CampaignInventoryController } from "@api/controllers/CampaignInventoryController";
import type { CampaignLocationsController } from "@api/controllers/CampaignLocationsController";
import type { CampaignMembersController } from "@api/controllers/CampaignMembersController";
import type { CampaignMonstersController } from "@api/controllers/CampaignMonstersController";
import type { CampaignNotesController } from "@api/controllers/CampaignNotesController";
import type { CampaignNpcsController } from "@api/controllers/CampaignNpcsController";
import type { CampaignQuestsController } from "@api/controllers/CampaignQuestsController";
import type { CampaignSessionsController } from "@api/controllers/CampaignSessionsController";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import type { ExternalOpen5eController } from "@api/controllers/ExternalOpen5eController";
import type { MonsterCatalogController } from "@api/controllers/MonsterCatalogController";
import { createHealthRouter } from "@api/routes/health.route";
import { createAuthRouter } from "@api/routes/auth.route";
import { createUsersRouter } from "@api/routes/users.routes";
import { createCampaignsRouter } from "@api/routes/campaigns.routes";
import { createExternalOpen5eRouter } from "@api/routes/external-open5e.routes";
import { createMonsterCatalogRouter } from "@api/routes/monster-catalog.routes";

export interface ApiRoutesOptions {
  healthController: HealthController;
  authController: AuthController;
  usersController: UsersController;
  campaignsController: CampaignsController;
  campaignMembersController: CampaignMembersController;
  campaignCharactersController: CampaignCharactersController;
  campaignChronicleController: CampaignChronicleController;
  campaignInventoryController: CampaignInventoryController;
  campaignMonstersController: CampaignMonstersController;
  campaignNpcsController: CampaignNpcsController;
  campaignLocationsController: CampaignLocationsController;
  campaignQuestsController: CampaignQuestsController;
  campaignNotesController: CampaignNotesController;
  campaignSessionsController: CampaignSessionsController;
  externalOpen5eController: ExternalOpen5eController;
  monsterCatalogController: MonsterCatalogController;
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
      options.campaignChronicleController,
      options.campaignInventoryController,
      options.campaignMonstersController,
      options.campaignNpcsController,
      options.campaignLocationsController,
      options.campaignQuestsController,
      options.campaignNotesController,
      options.campaignSessionsController,
      options.authMiddleware,
    ),
  );
  router.use(
    "/api/v1/external/open5e",
    createExternalOpen5eRouter(
      options.externalOpen5eController,
      options.authMiddleware,
    ),
  );
  router.use(
    "/api/v1/monster-catalog",
    createMonsterCatalogRouter(
      options.monsterCatalogController,
      options.authMiddleware,
    ),
  );

  if (options.registerAdditionalRoutes) {
    options.registerAdditionalRoutes(router);
  }

  return router;
}
