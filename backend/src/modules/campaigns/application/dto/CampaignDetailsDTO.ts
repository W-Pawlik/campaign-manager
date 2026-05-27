export interface CampaignDetailsDTO {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  gameSystemId: string | null;
  status: string;
  visibility: string;
  coverImageUrl: string | null;
  defaultLanguage: string | null;
  currentDateInWorld: string | null;
  worldName: string | null;
  startingLevel: number | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  deletedAt: string | null;
}
