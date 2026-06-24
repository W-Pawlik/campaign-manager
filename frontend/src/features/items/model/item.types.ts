import type {
  InventoryItemRarity,
  InventoryItemType,
  InventoryOwnerType,
  ItemVisibility,
} from "@/features/inventory";

export type ItemCatalogPage<TItem> = {
  items: TItem[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
};

export type ItemTemplateDetails = {
  id: string;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: InventoryItemType;
  rarity: InventoryItemRarity | null;
  isMagical: boolean;
  description: string | null;
  properties: unknown | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Open5eItemNormalizedData = {
  description?: string | null;
  type?: InventoryItemType;
  rarity?: InventoryItemRarity | null;
  isMagical?: boolean;
  weight?: number | null;
  weightUnit?: string | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
  requiresAttunement?: boolean | null;
  attunementDetail?: string | null;
  properties?: unknown | null;
  sourceDocumentName?: string | null;
} & Record<string, unknown>;

export type Open5eItemDetails = {
  id: string;
  provider: string;
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
  key: string | null;
  slug: string | null;
  url: string | null;
  name: string;
  illustrationUrl?: string | null;
  sourceDocumentKey: string | null;
  sourceDocumentName: string | null;
  normalizedData?: Open5eItemNormalizedData;
  cachedAt: string;
  expiresAt: string | null;
};

export type Open5eCatalogItemListItem = {
  provider: "OPEN5E";
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
  key: string;
  name: string;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: {
    itemType?: InventoryItemType;
    rarity?: InventoryItemRarity | null;
    weight?: number | null;
    valueAmount?: number | null;
    valueCurrency?: string | null;
    requiresAttunement?: boolean | null;
    isMagical?: boolean;
  } & Record<string, unknown>;
};

export type PublishedItemCatalogListItem = ItemTemplateDetails;

export type ItemsCatalogTab = "general" | "magic" | "community";

export type Open5eItemCatalogFilters = {
  documentKey?: string;
  limit?: number;
  ordering?: "name" | "-name";
  page?: number;
  search?: string;
};

export type PublishedItemsCatalogFilters = {
  isMagical?: boolean;
  limit?: number;
  page?: number;
  rarity?: InventoryItemRarity;
  search?: string;
  type?: InventoryItemType;
};

export type CreatePublishedItemPayload = {
  name: string;
  type?: InventoryItemType;
  rarity?: InventoryItemRarity | null;
  isMagical?: boolean;
  description?: string | null;
  properties?: unknown | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
};

export type UpdatePublishedItemPayload = Partial<CreatePublishedItemPayload>;

export type AddCatalogItemToCampaignPayload = {
  campaignId: string;
  ownerType: InventoryOwnerType;
  ownerId: string;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isAttuned?: boolean;
  isIdentified?: boolean;
  visibility?: ItemVisibility;
  nameOverride?: string;
  customProperties?: unknown | null;
};
