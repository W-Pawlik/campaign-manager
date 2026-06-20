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

function getRequiredRouteParam(req: Request, paramName: string, errorMessage: string): string {
  const value = req.params[paramName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }

  return value;
}
