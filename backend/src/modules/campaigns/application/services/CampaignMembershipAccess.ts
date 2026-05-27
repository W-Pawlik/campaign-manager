import { ForbiddenError } from "@core/application/errors/AppError";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export async function requireCampaignManagerRole(
  repository: CampaignMembershipRepository,
  campaignId: string,
  userId: string,
): Promise<CampaignRole> {
  const role = await repository.findUserRole(campaignId, userId);

  if (role === null || !role.canManageMembers()) {
    throw new ForbiddenError("Insufficient campaign member permissions");
  }

  return role;
}

export async function requireCampaignOwnerRole(
  repository: CampaignMembershipRepository,
  campaignId: string,
  userId: string,
): Promise<CampaignRole> {
  const role = await repository.findUserRole(campaignId, userId);

  if (role === null || !role.isOwner()) {
    throw new ForbiddenError("Only campaign owner can perform this action");
  }

  return role;
}
