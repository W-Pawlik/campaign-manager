export interface CampaignInvitationDTO {
  id: string;
  campaignId: string;
  userId: string;
  role: string;
  status: string;
  invitedById: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
