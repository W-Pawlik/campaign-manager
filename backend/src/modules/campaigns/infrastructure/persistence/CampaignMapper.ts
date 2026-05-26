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
      name: CampaignName.create(prismaCampaign.name),
      slug: prismaCampaign.slug,
      status: CampaignStatus.create(prismaCampaign.status),
      visibility: CampaignVisibility.create(prismaCampaign.visibility),
      createdAt: prismaCampaign.createdAt,
      updatedAt: prismaCampaign.updatedAt,
      deletedAt: prismaCampaign.deletedAt,
    });
  }

  public toPersistenceUpdate(campaign: Campaign): Prisma.CampaignUncheckedUpdateInput {
    return {
      name: campaign.name.value,
      slug: campaign.slug,
      status: campaign.status.value,
      visibility: campaign.visibility.value,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      deletedAt: campaign.deletedAt,
    };
  }
}