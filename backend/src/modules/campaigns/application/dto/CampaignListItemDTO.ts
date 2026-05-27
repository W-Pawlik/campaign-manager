export interface CampaignListItemDTO {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  visibility: string;
  coverImageUrl: string | null;
  worldName: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}
