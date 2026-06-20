export interface LocationPlayerViewDTO {
  id: string;
  campaignId: string;
  parentLocationId: string | null;
  name: string;
  type: string;
  shortDescription: string | null;
  description: string | null;
  mapImageUrl: string | null;
  coordinates: unknown | null;
  status: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}
