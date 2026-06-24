import type {
  InventoryOwnerType,
  ItemVisibility,
} from "@/features/inventory/model/inventory.types";

export type InventoryFormValues = {
  charges?: number | null;
  description?: string;
  isAttuned: boolean;
  isEquipped: boolean;
  isIdentified: boolean;
  maxCharges?: number | null;
  name: string;
  ownerId: string;
  ownerType: InventoryOwnerType;
  quantity: number;
  visibility: ItemVisibility;
};

export type InventoryTransferFormValues = {
  quantity?: number | null;
  targetOwnerId: string;
  targetOwnerType: InventoryOwnerType;
};
