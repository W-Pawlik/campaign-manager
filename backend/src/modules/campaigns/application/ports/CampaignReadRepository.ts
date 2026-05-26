import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";

export interface CampaignReadRepository {
  listForUser(userId: string): Promise<CampaignListItemDTO[]>;
  getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null>;
}