import { Router, type RequestHandler } from "express";
import type { CampaignCharactersController } from "@api/controllers/CampaignCharactersController";
import type { CampaignMembersController } from "@api/controllers/CampaignMembersController";
import type { CampaignNpcsController } from "@api/controllers/CampaignNpcsController";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  createCampaignCoverImageUploadSchema,
  createCampaignSchema,
  createCharacterSchema,
  createNpcSchema,
  inviteCampaignMemberSchema,
  updateCharacterSchema,
  updateCampaignMemberSchema,
  updateCampaignSchema,
  updateNpcSchema,
} from "@api/schemas/campaigns.schemas";

export function createCampaignsRouter(
  campaignsController: CampaignsController,
  campaignMembersController: CampaignMembersController,
  campaignCharactersController: CampaignCharactersController,
  campaignNpcsController: CampaignNpcsController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/", authMiddleware, async (req, res) => {
    await campaignsController.listUserCampaigns(req, res);
  });
  router.post("/", authMiddleware, createValidateBodyMiddleware(createCampaignSchema), async (req, res) => {
    await campaignsController.createCampaign(req, res);
  });
  router.get("/:campaignId", authMiddleware, async (req, res) => {
    await campaignsController.getCampaignDetails(req, res);
  });
  router.patch(
    "/:campaignId",
    authMiddleware,
    createValidateBodyMiddleware(updateCampaignSchema),
    async (req, res) => {
      await campaignsController.updateCampaign(req, res);
    },
  );
  router.post(
    "/:campaignId/cover-image-upload",
    authMiddleware,
    createValidateBodyMiddleware(createCampaignCoverImageUploadSchema),
    async (req, res) => {
      await campaignsController.createCampaignCoverImageUpload(req, res);
    },
  );
  router.get("/:campaignId/characters", authMiddleware, async (req, res) => {
    await campaignCharactersController.listCampaignCharacters(req, res);
  });
  router.post(
    "/:campaignId/characters",
    authMiddleware,
    createValidateBodyMiddleware(createCharacterSchema),
    async (req, res) => {
      await campaignCharactersController.createCharacter(req, res);
    },
  );
  router.get("/:campaignId/characters/:characterId", authMiddleware, async (req, res) => {
    await campaignCharactersController.getCharacterDetails(req, res);
  });
  router.patch(
    "/:campaignId/characters/:characterId",
    authMiddleware,
    createValidateBodyMiddleware(updateCharacterSchema),
    async (req, res) => {
      await campaignCharactersController.updateCharacter(req, res);
    },
  );
  router.delete("/:campaignId/characters/:characterId", authMiddleware, async (req, res) => {
    await campaignCharactersController.deleteCharacter(req, res);
  });
  router.post("/:campaignId/characters/:characterId/archive", authMiddleware, async (req, res) => {
    await campaignCharactersController.archiveCharacter(req, res);
  });
  router.get("/:campaignId/npcs", authMiddleware, async (req, res) => {
    await campaignNpcsController.listCampaignNpcs(req, res);
  });
  router.post(
    "/:campaignId/npcs",
    authMiddleware,
    createValidateBodyMiddleware(createNpcSchema),
    async (req, res) => {
      await campaignNpcsController.createNpc(req, res);
    },
  );
  router.get("/:campaignId/npcs/:npcId", authMiddleware, async (req, res) => {
    await campaignNpcsController.getNpcDetails(req, res);
  });
  router.patch(
    "/:campaignId/npcs/:npcId",
    authMiddleware,
    createValidateBodyMiddleware(updateNpcSchema),
    async (req, res) => {
      await campaignNpcsController.updateNpc(req, res);
    },
  );
  router.delete("/:campaignId/npcs/:npcId", authMiddleware, async (req, res) => {
    await campaignNpcsController.deleteNpc(req, res);
  });
  router.get("/:campaignId/members", authMiddleware, async (req, res) => {
    await campaignMembersController.listCampaignMembers(req, res);
  });
  router.post(
    "/:campaignId/members/invite",
    authMiddleware,
    createValidateBodyMiddleware(inviteCampaignMemberSchema),
    async (req, res) => {
      await campaignMembersController.inviteCampaignMember(req, res);
    },
  );
  router.patch(
    "/:campaignId/members/:memberId",
    authMiddleware,
    createValidateBodyMiddleware(updateCampaignMemberSchema),
    async (req, res) => {
      await campaignMembersController.updateCampaignMember(req, res);
    },
  );
  router.delete("/:campaignId/members/:memberId", authMiddleware, async (req, res) => {
    await campaignMembersController.removeCampaignMember(req, res);
  });
  router.get("/:campaignId/invitations", authMiddleware, async (req, res) => {
    await campaignMembersController.listCampaignInvitations(req, res);
  });
  router.post("/:campaignId/invitations/:invitationId/accept", authMiddleware, async (req, res) => {
    await campaignMembersController.acceptCampaignInvitation(req, res);
  });
  router.post("/:campaignId/invitations/:invitationId/decline", authMiddleware, async (req, res) => {
    await campaignMembersController.declineCampaignInvitation(req, res);
  });
  router.post("/:campaignId/archive", authMiddleware, async (req, res) => {
    await campaignsController.archiveCampaign(req, res);
  });
  router.post("/:campaignId/restore", authMiddleware, async (req, res) => {
    await campaignsController.restoreCampaign(req, res);
  });
  router.delete("/:campaignId", authMiddleware, async (req, res) => {
    await campaignsController.deleteCampaign(req, res);
  });

  return router;
}
