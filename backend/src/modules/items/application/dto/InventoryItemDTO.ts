export interface InventoryItemDTO {
  id: string;
  campaignId: string;
  itemTemplateId: string | null;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: string;
  rarity: string | null;
  isMagical: boolean;
  description: string | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  quantity: number;
  charges: number | null;
  maxCharges: number | null;
  isEquipped: boolean;
  isAttuned: boolean;
  isIdentified: boolean;
  ownerType: string;
  ownerId: string;
  visibility: string;
  customProperties: unknown | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
