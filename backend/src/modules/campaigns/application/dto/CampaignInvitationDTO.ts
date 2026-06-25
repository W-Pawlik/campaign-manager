export interface CampaignInvitationDTO {
  id: string;
  campaignId: string;
  userId: string;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  invitedById: string;
  invitedByUsername?: string | null;
  invitedByDisplayName?: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
