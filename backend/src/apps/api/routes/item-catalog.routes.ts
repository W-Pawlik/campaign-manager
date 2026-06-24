import { Router, type RequestHandler } from "express";
import type { ItemCatalogController } from "@api/controllers/ItemCatalogController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  copyCatalogItemToCampaignSchema,
  createPublishedItemSchema,
  updatePublishedItemSchema,
} from "@api/schemas/item-catalog.schemas";

export function createItemCatalogRouter(
  controller: ItemCatalogController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/providers/open5e/items", authMiddleware, async (req, res) => {
    await controller.listOpen5eItems(req, res);
  });
  router.get("/providers/open5e/items/:key", authMiddleware, async (req, res) => {
    await controller.getOpen5eItemDetails(req, res);
  });
  router.post(
    "/providers/open5e/items/:key/copy-to-campaign",
    authMiddleware,
    createValidateBodyMiddleware(copyCatalogItemToCampaignSchema),
    async (req, res) => {
      await controller.copyOpen5eItemToCampaign(req, res);
    },
  );
  router.get("/providers/open5e/magic-items", authMiddleware, async (req, res) => {
    await controller.listOpen5eMagicItems(req, res);
  });
  router.get("/providers/open5e/magic-items/:key", authMiddleware, async (req, res) => {
    await controller.getOpen5eMagicItemDetails(req, res);
  });
  router.post(
    "/providers/open5e/magic-items/:key/copy-to-campaign",
    authMiddleware,
    createValidateBodyMiddleware(copyCatalogItemToCampaignSchema),
    async (req, res) => {
      await controller.copyOpen5eMagicItemToCampaign(req, res);
    },
  );
  router.get("/public-items", authMiddleware, async (req, res) => {
    await controller.listPublishedItems(req, res);
  });
  router.post(
    "/public-items",
    authMiddleware,
    createValidateBodyMiddleware(createPublishedItemSchema),
    async (req, res) => {
      await controller.createPublishedItem(req, res);
    },
  );
  router.get("/public-items/:itemTemplateId", authMiddleware, async (req, res) => {
    await controller.getPublishedItemDetails(req, res);
  });
  router.patch(
    "/public-items/:itemTemplateId",
    authMiddleware,
    createValidateBodyMiddleware(updatePublishedItemSchema),
    async (req, res) => {
      await controller.updatePublishedItem(req, res);
    },
  );
  router.post(
    "/public-items/:itemTemplateId/copy-to-campaign",
    authMiddleware,
    createValidateBodyMiddleware(copyCatalogItemToCampaignSchema),
    async (req, res) => {
      await controller.copyPublishedItemToCampaign(req, res);
    },
  );

  return router;
}
