import type { PrismaClient } from "@prisma/client";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import { MEMBER_STATUS } from "@modules/campaigns/domain/value-objects/MemberStatus";

export class PrismaCampaignReadRepository implements CampaignReadRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async listForUser(userId: string): Promise<CampaignListItemDTO[]> {
    const memberships = await this.prismaClient.campaignMember.findMany({
      where: {
        userId,
        status: MEMBER_STATUS.ACTIVE,
        campaign: {
          deletedAt: null,
        },
      },
      include: {
        campaign: true,
      },
      orderBy: {
        campaign: {
          updatedAt: "desc",
        },
      },
    });

    return memberships.map((membership) => ({
      id: membership.campaign.id,
      ownerId: membership.campaign.ownerId,
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      description: membership.campaign.description,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      coverImageUrl: membership.campaign.coverImageUrl,
      worldName: membership.campaign.worldName,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
      archivedAt: membership.campaign.archivedAt?.toISOString() ?? null,
    }));
  }

  public async getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null> {
    const membership = await this.prismaClient.campaignMember.findFirst({
      where: {
        userId,
        campaignId,
        status: MEMBER_STATUS.ACTIVE,
        campaign: {
          deletedAt: null,
        },
      },
      include: {
        campaign: true,
      },
    });

    if (membership === null) {
      return null;
    }

    return {
      id: membership.campaign.id,
      ownerId: membership.campaign.ownerId,
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      description: membership.campaign.description,
      gameSystemId: membership.campaign.gameSystemId,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      coverImageUrl: membership.campaign.coverImageUrl,
      defaultLanguage: membership.campaign.defaultLanguage,
      currentDateInWorld: membership.campaign.currentDateInWorld,
      worldName: membership.campaign.worldName,
      startingLevel: membership.campaign.startingLevel,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
      archivedAt: membership.campaign.archivedAt?.toISOString() ?? null,
      deletedAt: membership.campaign.deletedAt?.toISOString() ?? null,
    };
  }
}
