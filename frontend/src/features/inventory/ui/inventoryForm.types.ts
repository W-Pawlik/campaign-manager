import type {
  InventoryItemRarity,
  InventoryOwnerType,
  InventoryItemType,
  ItemVisibility,
} from "@/features/inventory/model/inventory.types";

export type InventoryFormValues = {
  charges?: number | null;
  description?: string;
  isMagical: boolean;
  isAttuned: boolean;
  isEquipped: boolean;
  isIdentified: boolean;
  maxCharges?: number | null;
  name: string;
  ownerId: string;
  ownerType: InventoryOwnerType;
  quantity: number;
  rarity: InventoryItemRarity | "" | null;
  type: InventoryItemType;
  valueAmount?: number | null;
  valueCurrency?: string;
  visibility: ItemVisibility;
  weight?: number | null;
};

export type InventoryTransferFormValues = {
  quantity?: number | null;
  targetOwnerId: string;
  targetOwnerType: InventoryOwnerType;
};
