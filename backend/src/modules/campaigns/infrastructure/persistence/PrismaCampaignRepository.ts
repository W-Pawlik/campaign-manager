import type { PrismaClient } from "@prisma/client";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CAMPAIGN_ROLE, CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MEMBER_STATUS } from "@modules/campaigns/domain/value-objects/MemberStatus";
import type { CampaignMapper } from "@modules/campaigns/infrastructure/persistence/CampaignMapper";

export class PrismaCampaignRepository implements CampaignRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly campaignMapper: CampaignMapper,
  ) {}

  public async findById(campaignId: string): Promise<Campaign | null> {
    const campaign = await this.prismaClient.campaign.findUnique({
      where: { id: campaignId },
    });

    if (campaign === null) {
      return null;
    }

    return this.campaignMapper.toDomain(campaign);
  }

  public async findBySlug(slug: string): Promise<Campaign | null> {
    const campaign = await this.prismaClient.campaign.findUnique({
      where: { slug },
    });

    if (campaign === null) {
      return null;
    }

    return this.campaignMapper.toDomain(campaign);
  }

  public async findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null> {
    const member = await this.prismaClient.campaignMember.findFirst({
      where: {
        campaignId,
        userId,
        status: MEMBER_STATUS.ACTIVE,
      },
    });

    if (member === null) {
      return null;
    }

    return CampaignRole.create(member.role);
  }

  public async create(campaign: Campaign, ownerUserId: string): Promise<void> {
    await this.prismaClient.$transaction(async (tx) => {
      await tx.campaign.create({
        data: {
          id: campaign.id,
          ownerId: campaign.ownerId,
          name: campaign.name.value,
          slug: campaign.slug,
          description: campaign.description,
          gameSystemId: campaign.gameSystemId,
          status: campaign.status.value,
          visibility: campaign.visibility.value,
          coverImageUrl: campaign.coverImageUrl,
          coverImageKey: campaign.coverImageKey,
          defaultLanguage: campaign.defaultLanguage,
          currentDateInWorld: campaign.currentDateInWorld,
          worldName: campaign.worldName,
          startingLevel: campaign.startingLevel,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
          archivedAt: campaign.archivedAt,
          deletedAt: campaign.deletedAt,
        },
      });

      await tx.campaignMember.create({
        data: {
          campaignId: campaign.id,
          userId: ownerUserId,
          role: CAMPAIGN_ROLE.OWNER,
          status: MEMBER_STATUS.ACTIVE,
          joinedAt: campaign.createdAt,
        },
      });
    });
  }

  public async save(campaign: Campaign): Promise<void> {
    await this.prismaClient.campaign.update({
      where: { id: campaign.id },
      data: this.campaignMapper.toPersistenceUpdate(campaign),
    });
  }
}
