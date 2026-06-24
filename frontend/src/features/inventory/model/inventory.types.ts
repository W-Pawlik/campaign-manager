import type { CampaignInventoryListItem } from "@/features/campaigns";

export type InventoryOwnerType =
  | "CHARACTER"
  | "CAMPAIGN_PARTY"
  | "NPC"
  | "LOCATION"
  | "QUEST";

export type ItemVisibility = "PUBLIC" | "OWNER_ONLY" | "GM_ONLY";

export type InventoryItemDetails = CampaignInventoryListItem;

export type CreateInventoryItemPayload = {
  itemTemplateId?: string | null;
  name?: string;
  description?: string | null;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isEquipped?: boolean;
  isAttuned?: boolean;
  isIdentified?: boolean;
  ownerType: InventoryOwnerType;
  ownerId: string;
  visibility?: ItemVisibility;
  customProperties?: unknown | null;
};

export type UpdateInventoryItemPayload = {
  name?: string;
  description?: string | null;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isAttuned?: boolean;
  isIdentified?: boolean;
  visibility?: ItemVisibility;
  customProperties?: unknown | null;
};

export type TransferInventoryItemPayload = {
  targetOwnerType: InventoryOwnerType;
  targetOwnerId: string;
  quantity?: number;
};

export const inventoryOwnerTypeOptions: InventoryOwnerType[] = [
  "CHARACTER",
  "CAMPAIGN_PARTY",
  "NPC",
  "LOCATION",
  "QUEST",
];

export const itemVisibilityOptions: ItemVisibility[] = ["PUBLIC", "OWNER_ONLY", "GM_ONLY"];
