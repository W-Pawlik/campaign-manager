import { Router, type RequestHandler } from "express";
import type { MonsterCatalogController } from "@api/controllers/MonsterCatalogController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  copyCatalogMonsterToCampaignSchema,
  createPublishedMonsterSchema,
} from "@api/schemas/monster-catalog.schemas";

export function createMonsterCatalogRouter(
  controller: MonsterCatalogController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/providers/open5e/creatures", authMiddleware, async (req, res) => {
    await controller.listOpen5eCreatures(req, res);
  });
  router.get("/providers/open5e/creatures/:key", authMiddleware, async (req, res) => {
    await controller.getOpen5eCreatureDetails(req, res);
  });
  router.post(
    "/providers/open5e/creatures/:key/copy-to-campaign",
    authMiddleware,
    createValidateBodyMiddleware(copyCatalogMonsterToCampaignSchema),
    async (req, res) => {
      await controller.copyOpen5eCreatureToCampaign(req, res);
    },
  );
  router.get("/public-monsters", authMiddleware, async (req, res) => {
    await controller.listPublishedMonsters(req, res);
  });
  router.post(
    "/public-monsters",
    authMiddleware,
    createValidateBodyMiddleware(createPublishedMonsterSchema),
    async (req, res) => {
      await controller.createPublishedMonster(req, res);
    },
  );
  router.get("/public-monsters/:monsterId", authMiddleware, async (req, res) => {
    await controller.getPublishedMonsterDetails(req, res);
  });
  router.post(
    "/public-monsters/:monsterId/copy-to-campaign",
    authMiddleware,
    createValidateBodyMiddleware(copyCatalogMonsterToCampaignSchema),
    async (req, res) => {
      await controller.copyPublishedMonsterToCampaign(req, res);
    },
  );

  return router;
}
