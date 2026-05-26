import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export interface CampaignRepository {
  findById(campaignId: string): Promise<Campaign | null>;
  findBySlug(slug: string): Promise<Campaign | null>;
  findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null>;
  create(campaign: Campaign, ownerUserId: string): Promise<void>;
  save(campaign: Campaign): Promise<void>;
}