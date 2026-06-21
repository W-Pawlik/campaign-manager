export interface InventoryItemDTO {
  id: string;
  campaignId: string;
  itemTemplateId: string | null;
  name: string;
  description: string | null;
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
