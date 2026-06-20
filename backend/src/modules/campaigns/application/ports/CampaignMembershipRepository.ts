import type { CampaignInvitation } from "@modules/campaigns/domain/entities/CampaignInvitation";
import type { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export interface CampaignMembershipRepository {
  findActiveMemberByUserId(campaignId: string, userId: string): Promise<CampaignMember | null>;
  listActiveMembers(campaignId: string): Promise<CampaignMember[]>;
  findMemberById(campaignId: string, memberId: string): Promise<CampaignMember | null>;
  findActiveInvitationByUserId(
    campaignId: string,
    userId: string,
  ): Promise<CampaignInvitation | null>;
  findInvitationById(
    campaignId: string,
    invitationId: string,
  ): Promise<CampaignInvitation | null>;
  createInvitation(invitation: CampaignInvitation): Promise<void>;
  saveInvitation(invitation: CampaignInvitation): Promise<void>;
  upsertActiveMemberFromInvitation(invitation: CampaignInvitation): Promise<CampaignMember>;
  saveMember(member: CampaignMember): Promise<void>;
  transferOwnership(campaignId: string, fromUserId: string, toMember: CampaignMember): Promise<void>;
  countActiveOwners(campaignId: string): Promise<number>;
  findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null>;
}
