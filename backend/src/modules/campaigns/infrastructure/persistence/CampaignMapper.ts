import type { Campaign as PrismaCampaign } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export class CampaignMapper {
  public toDomain(prismaCampaign: PrismaCampaign): Campaign {
    return Campaign.create({
      id: prismaCampaign.id,
      ownerId: prismaCampaign.ownerId,
      name: CampaignName.create(prismaCampaign.name),
      slug: prismaCampaign.slug,
      description: prismaCampaign.description,
      gameSystemId: prismaCampaign.gameSystemId,
      status: CampaignStatus.create(prismaCampaign.status),
      visibility: CampaignVisibility.create(prismaCampaign.visibility),
      coverImageUrl: prismaCampaign.coverImageUrl,
      coverImageKey: prismaCampaign.coverImageKey,
      defaultLanguage: prismaCampaign.defaultLanguage,
      currentDateInWorld: prismaCampaign.currentDateInWorld,
      worldName: prismaCampaign.worldName,
      startingLevel: prismaCampaign.startingLevel,
      createdAt: prismaCampaign.createdAt,
      updatedAt: prismaCampaign.updatedAt,
      archivedAt: prismaCampaign.archivedAt,
      deletedAt: prismaCampaign.deletedAt,
    });
  }

  public toPersistenceUpdate(campaign: Campaign): Prisma.CampaignUncheckedUpdateInput {
    return {
      name: campaign.name.value,
      slug: campaign.slug,
      ownerId: campaign.ownerId,
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
    };
  }
}
