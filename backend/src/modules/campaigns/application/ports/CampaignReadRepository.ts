import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";

export interface CampaignReadRepository {
  listForUser(userId: string): Promise<CampaignListItemDTO[]>;
  getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null>;
  listMembers(campaignId: string): Promise<CampaignMemberDTO[]>;
  listInvitations(campaignId: string): Promise<CampaignInvitationDTO[]>;
  listInvitationsForUser(userId: string): Promise<CampaignInvitationDTO[]>;
}
