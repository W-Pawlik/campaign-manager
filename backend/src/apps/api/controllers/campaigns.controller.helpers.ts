import type { Request, Response } from "express";
import { UnauthorizedError, ValidationError } from "@core/application/errors/AppError";

export function getAuthUserId(res: Response): string {
  const userId = res.locals.authUserId as string | undefined;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
}

export function getCampaignId(req: Request): string {
  return getRequiredRouteParam(req, "campaignId", "Campaign id is required");
}

export function getMemberId(req: Request): string {
  return getRequiredRouteParam(req, "memberId", "Campaign member id is required");
}

export function getInvitationId(req: Request): string {
  return getRequiredRouteParam(req, "invitationId", "Campaign invitation id is required");
}

export function getCharacterId(req: Request): string {
  return getRequiredRouteParam(req, "characterId", "Character id is required");
}

export function getNpcId(req: Request): string {
  return getRequiredRouteParam(req, "npcId", "NPC id is required");
}

export function getLocationId(req: Request): string {
  return getRequiredRouteParam(req, "locationId", "Location id is required");
}

export function getQuestId(req: Request): string {
  return getRequiredRouteParam(req, "questId", "Quest id is required");
}

export function getObjectiveId(req: Request): string {
  return getRequiredRouteParam(req, "objectiveId", "Quest objective id is required");
}

export function getNoteId(req: Request): string {
  return getRequiredRouteParam(req, "noteId", "Note id is required");
}

export function getSessionId(req: Request): string {
  return getRequiredRouteParam(req, "sessionId", "Session id is required");
}

export function getChronicleEntryId(req: Request): string {
  return getRequiredRouteParam(req, "entryId", "Chronicle entry id is required");
}

function getRequiredRouteParam(req: Request, paramName: string, errorMessage: string): string {
  const value = req.params[paramName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }

  return value;
}
