import type { CampaignInventoryListItem } from "@/features/campaigns";

export type InventoryOwnerType =
  | "CHARACTER"
  | "CAMPAIGN_PARTY"
  | "NPC"
  | "LOCATION"
  | "QUEST"
  | "SESSION";

export type InventoryItemType =
  | "WEAPON"
  | "ARMOR"
  | "SHIELD"
  | "POTION"
  | "SCROLL"
  | "WONDROUS_ITEM"
  | "TOOL"
  | "GEAR"
  | "TREASURE"
  | "QUEST_ITEM"
  | "CONSUMABLE"
  | "OTHER";

export type InventoryItemRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "VERY_RARE"
  | "LEGENDARY"
  | "ARTIFACT"
  | "UNKNOWN";

export type ItemVisibility = "PUBLIC" | "OWNER_ONLY" | "GM_ONLY";

export type InventoryItemDetails = CampaignInventoryListItem;

export type CreateInventoryItemPayload = {
  itemTemplateId?: string | null;
  source?: "CUSTOM" | "OPEN5E" | "SYSTEM";
  name?: string;
  type?: InventoryItemType;
  rarity?: InventoryItemRarity | null;
  isMagical?: boolean;
  description?: string | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
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
  type?: InventoryItemType;
  rarity?: InventoryItemRarity | null;
  isMagical?: boolean;
  description?: string | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
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
  "SESSION",
];

export const itemVisibilityOptions: ItemVisibility[] = ["PUBLIC", "OWNER_ONLY", "GM_ONLY"];
export const inventoryItemTypeOptions: InventoryItemType[] = [
  "WEAPON",
  "ARMOR",
  "SHIELD",
  "POTION",
  "SCROLL",
  "WONDROUS_ITEM",
  "TOOL",
  "GEAR",
  "TREASURE",
  "QUEST_ITEM",
  "CONSUMABLE",
  "OTHER",
];
export const inventoryItemRarityOptions: InventoryItemRarity[] = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "LEGENDARY",
  "ARTIFACT",
  "UNKNOWN",
];
