export interface CampaignMemberDTO {
  id: string;
  campaignId: string;
  userId: string;
  username?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  nickname: string | null;
  joinedAt: string | null;
  invitedAt: string | null;
  invitedById: string | null;
  invitedByUsername?: string | null;
  createdAt: string;
  updatedAt: string;
}
