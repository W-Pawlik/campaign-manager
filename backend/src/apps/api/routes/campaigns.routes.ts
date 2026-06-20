import { Router, type RequestHandler } from "express";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  createCampaignCoverImageUploadSchema,
  createCampaignSchema,
  createCharacterSchema,
  inviteCampaignMemberSchema,
  updateCharacterSchema,
  updateCampaignMemberSchema,
  updateCampaignSchema,
} from "@api/schemas/campaigns.schemas";

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
  router.post(
    "/:campaignId/cover-image-upload",
    authMiddleware,
    createValidateBodyMiddleware(createCampaignCoverImageUploadSchema),
    async (req, res) => {
      await controller.createCampaignCoverImageUpload(req, res);
    },
  );
  router.get("/:campaignId/characters", authMiddleware, async (req, res) => {
    await controller.listCampaignCharacters(req, res);
  });
  router.post(
    "/:campaignId/characters",
    authMiddleware,
    createValidateBodyMiddleware(createCharacterSchema),
    async (req, res) => {
      await controller.createCharacter(req, res);
    },
  );
  router.get("/:campaignId/characters/:characterId", authMiddleware, async (req, res) => {
    await controller.getCharacterDetails(req, res);
  });
  router.patch(
    "/:campaignId/characters/:characterId",
    authMiddleware,
    createValidateBodyMiddleware(updateCharacterSchema),
    async (req, res) => {
      await controller.updateCharacter(req, res);
    },
  );
  router.delete("/:campaignId/characters/:characterId", authMiddleware, async (req, res) => {
    await controller.deleteCharacter(req, res);
  });
  router.post("/:campaignId/characters/:characterId/archive", authMiddleware, async (req, res) => {
    await controller.archiveCharacter(req, res);
  });
  router.get("/:campaignId/members", authMiddleware, async (req, res) => {
    await controller.listCampaignMembers(req, res);
  });
  router.post(
    "/:campaignId/members/invite",
    authMiddleware,
    createValidateBodyMiddleware(inviteCampaignMemberSchema),
    async (req, res) => {
      await controller.inviteCampaignMember(req, res);
    },
  );
  router.patch(
    "/:campaignId/members/:memberId",
    authMiddleware,
    createValidateBodyMiddleware(updateCampaignMemberSchema),
    async (req, res) => {
      await controller.updateCampaignMember(req, res);
    },
  );
  router.delete("/:campaignId/members/:memberId", authMiddleware, async (req, res) => {
    await controller.removeCampaignMember(req, res);
  });
  router.get("/:campaignId/invitations", authMiddleware, async (req, res) => {
    await controller.listCampaignInvitations(req, res);
  });
  router.post("/:campaignId/invitations/:invitationId/accept", authMiddleware, async (req, res) => {
    await controller.acceptCampaignInvitation(req, res);
  });
  router.post("/:campaignId/invitations/:invitationId/decline", authMiddleware, async (req, res) => {
    await controller.declineCampaignInvitation(req, res);
  });
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
