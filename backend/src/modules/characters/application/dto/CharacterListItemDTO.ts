export interface CharacterListItemDTO {
  id: string;
  campaignId: string;
  ownerUserId: string | null;
  ownerUsername?: string | null;
  ownerDisplayName?: string | null;
  name: string;
  avatarUrl: string | null;
  type: string;
  status: string;
  race: string | null;
  characterClass: string | null;
  level: number | null;
  updatedAt: string;
}
