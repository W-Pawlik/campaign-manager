import type { PrismaClient } from "@prisma/client";
import { CAMPAIGN_STATUS } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import type { UserCampaignOwnershipChecker } from "@modules/users/application/ports/UserCampaignOwnershipChecker";

export class PrismaUserCampaignOwnershipChecker implements UserCampaignOwnershipChecker {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async hasActiveOwnedCampaigns(userId: string): Promise<boolean> {
    const ownedActiveCampaign = await this.prismaClient.campaign.findFirst({
      where: {
        ownerId: userId,
        deletedAt: null,
        status: CAMPAIGN_STATUS.ACTIVE,
      },
      select: {
        id: true,
      },
    });

    return ownedActiveCampaign !== null;
  }
}
