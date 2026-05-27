import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export function mapCampaignDetailsFromDomain(
  campaign: Campaign,
  role: CampaignRole,
): CampaignDetailsDTO {
  return {
    id: campaign.id,
    ownerId: campaign.ownerId,
    name: campaign.name.value,
    slug: campaign.slug,
    description: campaign.description,
    gameSystemId: campaign.gameSystemId,
    status: campaign.status.value,
    visibility: campaign.visibility.value,
    coverImageUrl: campaign.coverImageUrl,
    defaultLanguage: campaign.defaultLanguage,
    currentDateInWorld: campaign.currentDateInWorld,
    worldName: campaign.worldName,
    startingLevel: campaign.startingLevel,
    role: role.value,
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString(),
    archivedAt: campaign.archivedAt?.toISOString() ?? null,
    deletedAt: campaign.deletedAt?.toISOString() ?? null,
  };
}
