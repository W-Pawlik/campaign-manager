import { Router, type RequestHandler } from "express";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import { createCampaignSchema, updateCampaignSchema } from "@api/schemas/campaigns.schemas";

export function createCampaignsRouter(
  controller: CampaignsController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/", authMiddleware, async (req, res) => {
    await controller.listUserCampaigns(req, res);
  });
  router.post("/", authMiddleware, createValidateBodyMiddleware(createCampaignSchema), async (req, res) => {
    await controller.createCampaign(req, res);
  });
  router.get("/:campaignId", authMiddleware, async (req, res) => {
    await controller.getCampaignDetails(req, res);
  });
  router.patch(
    "/:campaignId",
    authMiddleware,
    createValidateBodyMiddleware(updateCampaignSchema),
    async (req, res) => {
      await controller.updateCampaign(req, res);
    },
  );
  router.post("/:campaignId/archive", authMiddleware, async (req, res) => {
    await controller.archiveCampaign(req, res);
  });
  router.post("/:campaignId/restore", authMiddleware, async (req, res) => {
    await controller.restoreCampaign(req, res);
  });
  router.delete("/:campaignId", authMiddleware, async (req, res) => {
    await controller.deleteCampaign(req, res);
  });

  return router;
}