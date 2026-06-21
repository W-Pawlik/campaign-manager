export interface QuestListItemDTO {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  visibility: string;
  priority: string;
  giverNpcId: string | null;
  relatedLocationId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  rewardDescription: string | null;
  createdAt: string;
  updatedAt: string;
}
