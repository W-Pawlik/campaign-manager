export interface NpcPlayerViewDTO {
  id: string;
  campaignId: string;
  name: string;
  title: string | null;
  avatarUrl: string | null;
  race: string | null;
  occupation: string | null;
  faction: string | null;
  locationId: string | null;
  attitude: string;
  importance: string;
  status: string;
  publicDescription: string | null;
  appearance: string | null;
  personality: string | null;
  statBlock: unknown | null;
  externalReferenceId: string | null;
  createdAt: string;
  updatedAt: string;
}
