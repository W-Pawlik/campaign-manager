export interface MonsterListItemDTO {
  id: string;
  campaignId: string | null;
  name: string;
  slug: string;
  source: string;
  size: string | null;
  type: string | null;
  armorClass: number | null;
  hitPoints: number | null;
  challengeRating: string | null;
  challengeRatingDecimal: number | null;
  visibility: string;
  status: string;
}
