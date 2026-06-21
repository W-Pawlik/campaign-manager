import { Router, type RequestHandler } from "express";
import type { CampaignCharactersController } from "@api/controllers/CampaignCharactersController";
import type { CampaignChronicleController } from "@api/controllers/CampaignChronicleController";
import type { CampaignLocationsController } from "@api/controllers/CampaignLocationsController";
import type { CampaignMembersController } from "@api/controllers/CampaignMembersController";
import type { CampaignNotesController } from "@api/controllers/CampaignNotesController";
import type { CampaignNpcsController } from "@api/controllers/CampaignNpcsController";
import type { CampaignSessionsController } from "@api/controllers/CampaignSessionsController";
import type { CampaignsController } from "@api/controllers/CampaignsController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  createCampaignCoverImageUploadSchema,
  createCampaignSchema,
  createCharacterSchema,
  createChronicleEntrySchema,
  createLocationSchema,
  createNoteSchema,
  createNpcSchema,
  createSessionSchema,
  inviteCampaignMemberSchema,
  updateCharacterSchema,
  updateCampaignMemberSchema,
  updateCampaignSchema,
  updateLocationSchema,
  updateChronicleEntrySchema,
  updateNoteSchema,
  updateNpcSchema,
  updateSessionSchema,
} from "@api/schemas/campaigns.schemas";

export function createCampaignsRouter(
  campaignsController: CampaignsController,
  campaignMembersController: CampaignMembersController,
  campaignCharactersController: CampaignCharactersController,
  campaignChronicleController: CampaignChronicleController,
  campaignNpcsController: CampaignNpcsController,
  campaignLocationsController: CampaignLocationsController,
  campaignNotesController: CampaignNotesController,
  campaignSessionsController: CampaignSessionsController,
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
  router.get("/:campaignId/chronicle", authMiddleware, async (req, res) => {
    await campaignChronicleController.listCampaignChronicle(req, res);
  });
  router.post(
    "/:campaignId/chronicle",
    authMiddleware,
    createValidateBodyMiddleware(createChronicleEntrySchema),
    async (req, res) => {
      await campaignChronicleController.createChronicleEntry(req, res);
    },
  );
  router.get("/:campaignId/chronicle/:entryId", authMiddleware, async (req, res) => {
    await campaignChronicleController.getChronicleEntryDetails(req, res);
  });
  router.patch(
    "/:campaignId/chronicle/:entryId",
    authMiddleware,
    createValidateBodyMiddleware(updateChronicleEntrySchema),
    async (req, res) => {
      await campaignChronicleController.updateChronicleEntry(req, res);
    },
  );
  router.delete("/:campaignId/chronicle/:entryId", authMiddleware, async (req, res) => {
    await campaignChronicleController.deleteChronicleEntry(req, res);
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
  router.get("/:campaignId/locations", authMiddleware, async (req, res) => {
    await campaignLocationsController.listCampaignLocations(req, res);
  });
  router.post(
    "/:campaignId/locations",
    authMiddleware,
    createValidateBodyMiddleware(createLocationSchema),
    async (req, res) => {
      await campaignLocationsController.createLocation(req, res);
    },
  );
  router.get("/:campaignId/locations/:locationId", authMiddleware, async (req, res) => {
    await campaignLocationsController.getLocationDetails(req, res);
  });
  router.patch(
    "/:campaignId/locations/:locationId",
    authMiddleware,
    createValidateBodyMiddleware(updateLocationSchema),
    async (req, res) => {
      await campaignLocationsController.updateLocation(req, res);
    },
  );
  router.delete("/:campaignId/locations/:locationId", authMiddleware, async (req, res) => {
    await campaignLocationsController.deleteLocation(req, res);
  });
  router.get("/:campaignId/notes", authMiddleware, async (req, res) => {
    await campaignNotesController.listCampaignNotes(req, res);
  });
  router.post(
    "/:campaignId/notes",
    authMiddleware,
    createValidateBodyMiddleware(createNoteSchema),
    async (req, res) => {
      await campaignNotesController.createNote(req, res);
    },
  );
  router.get("/:campaignId/notes/:noteId", authMiddleware, async (req, res) => {
    await campaignNotesController.getNoteDetails(req, res);
  });
  router.patch(
    "/:campaignId/notes/:noteId",
    authMiddleware,
    createValidateBodyMiddleware(updateNoteSchema),
    async (req, res) => {
      await campaignNotesController.updateNote(req, res);
    },
  );
  router.delete("/:campaignId/notes/:noteId", authMiddleware, async (req, res) => {
    await campaignNotesController.deleteNote(req, res);
  });
  router.get("/:campaignId/sessions", authMiddleware, async (req, res) => {
    await campaignSessionsController.listCampaignSessions(req, res);
  });
  router.post(
    "/:campaignId/sessions",
    authMiddleware,
    createValidateBodyMiddleware(createSessionSchema),
    async (req, res) => {
      await campaignSessionsController.createSession(req, res);
    },
  );
  router.get("/:campaignId/sessions/:sessionId", authMiddleware, async (req, res) => {
    await campaignSessionsController.getSessionDetails(req, res);
  });
  router.patch(
    "/:campaignId/sessions/:sessionId",
    authMiddleware,
    createValidateBodyMiddleware(updateSessionSchema),
    async (req, res) => {
      await campaignSessionsController.updateSession(req, res);
    },
  );
  router.delete("/:campaignId/sessions/:sessionId", authMiddleware, async (req, res) => {
    await campaignSessionsController.cancelSession(req, res);
  });
  router.post("/:campaignId/sessions/:sessionId/confirm", authMiddleware, async (req, res) => {
    await campaignSessionsController.confirmAttendance(req, res);
  });
  router.post("/:campaignId/sessions/:sessionId/decline", authMiddleware, async (req, res) => {
    await campaignSessionsController.declineAttendance(req, res);
  });
  router.post("/:campaignId/sessions/:sessionId/complete", authMiddleware, async (req, res) => {
    await campaignSessionsController.completeSession(req, res);
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
