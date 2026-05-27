export interface CampaignMemberDTO {
  id: string;
  campaignId: string;
  userId: string;
  role: string;
  status: string;
  nickname: string | null;
  joinedAt: string | null;
  invitedAt: string | null;
  invitedById: string | null;
  createdAt: string;
  updatedAt: string;
}
