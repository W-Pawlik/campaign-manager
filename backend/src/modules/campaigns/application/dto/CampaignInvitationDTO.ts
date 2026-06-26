export interface CampaignInvitationDTO {
  id: string;
  campaignId: string;
  campaignName?: string | null;
  userId: string;
  username?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  invitedById: string;
  invitedByUsername?: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
