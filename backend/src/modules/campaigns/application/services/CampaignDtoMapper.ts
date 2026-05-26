import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export function mapCampaignDetailsFromDomain(
  campaign: Campaign,
  role: CampaignRole,
): CampaignDetailsDTO {
  return {
    id: campaign.id,
    name: campaign.name.value,
    slug: campaign.slug,
    status: campaign.status.value,
    visibility: campaign.visibility.value,
    role: role.value,
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString(),
    deletedAt: campaign.deletedAt?.toISOString() ?? null,
  };
}