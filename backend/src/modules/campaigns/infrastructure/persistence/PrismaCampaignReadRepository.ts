import type { PrismaClient } from "@prisma/client";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";

export class PrismaCampaignReadRepository implements CampaignReadRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async listForUser(userId: string): Promise<CampaignListItemDTO[]> {
    const memberships = await this.prismaClient.campaignMember.findMany({
      where: {
        userId,
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
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
    }));
  }

  public async getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null> {
    const membership = await this.prismaClient.campaignMember.findFirst({
      where: {
        userId,
        campaignId,
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
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
      deletedAt: membership.campaign.deletedAt?.toISOString() ?? null,
    };
  }
}