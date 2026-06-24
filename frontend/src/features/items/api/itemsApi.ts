import { httpClient } from "@/core/api/httpClient";
import type {
  AddCatalogItemToCampaignPayload,
  CreatePublishedItemPayload,
  ItemCatalogPage,
  ItemTemplateDetails,
  Open5eCatalogItemListItem,
  Open5eItemCatalogFilters,
  Open5eItemDetails,
  PublishedItemCatalogListItem,
  PublishedItemsCatalogFilters,
  UpdatePublishedItemPayload,
} from "@/features/items/model/item.types";
import type { InventoryItemDetails } from "@/features/inventory";

const itemCatalogBasePath = "/item-catalog";

export const itemsApi = {
  async copyOpen5eGeneralItemToCampaign(
    key: string,
    payload: AddCatalogItemToCampaignPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.post<InventoryItemDetails>(
      `${itemCatalogBasePath}/providers/open5e/items/${key}/copy-to-campaign`,
      payload,
    );

    return response.data;
  },

  async copyOpen5eMagicItemToCampaign(
    key: string,
    payload: AddCatalogItemToCampaignPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.post<InventoryItemDetails>(
      `${itemCatalogBasePath}/providers/open5e/magic-items/${key}/copy-to-campaign`,
      payload,
    );

    return response.data;
  },

  async copyPublishedItemToCampaign(
    itemTemplateId: string,
    payload: AddCatalogItemToCampaignPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.post<InventoryItemDetails>(
      `${itemCatalogBasePath}/public-items/${itemTemplateId}/copy-to-campaign`,
      payload,
    );

    return response.data;
  },

  async createPublishedItem(payload: CreatePublishedItemPayload): Promise<ItemTemplateDetails> {
    const response = await httpClient.post<ItemTemplateDetails>(
      `${itemCatalogBasePath}/public-items`,
      payload,
    );

    return response.data;
  },

  async getOpen5eGeneralItemDetails(key: string): Promise<Open5eItemDetails> {
    const response = await httpClient.get<Open5eItemDetails>(
      `${itemCatalogBasePath}/providers/open5e/items/${key}`,
    );

    return response.data;
  },

  async getOpen5eMagicItemDetails(key: string): Promise<Open5eItemDetails> {
    const response = await httpClient.get<Open5eItemDetails>(
      `${itemCatalogBasePath}/providers/open5e/magic-items/${key}`,
    );

    return response.data;
  },

  async getPublishedItemDetails(itemTemplateId: string): Promise<ItemTemplateDetails> {
    const response = await httpClient.get<ItemTemplateDetails>(
      `${itemCatalogBasePath}/public-items/${itemTemplateId}`,
    );

    return response.data;
  },

  async listOpen5eGeneralItems(
    filters: Open5eItemCatalogFilters,
  ): Promise<ItemCatalogPage<Open5eCatalogItemListItem>> {
    const response = await httpClient.get<ItemCatalogPage<Open5eCatalogItemListItem>>(
      `${itemCatalogBasePath}/providers/open5e/items`,
      { params: filters },
    );

    return response.data;
  },

  async listOpen5eMagicItems(
    filters: Open5eItemCatalogFilters,
  ): Promise<ItemCatalogPage<Open5eCatalogItemListItem>> {
    const response = await httpClient.get<ItemCatalogPage<Open5eCatalogItemListItem>>(
      `${itemCatalogBasePath}/providers/open5e/magic-items`,
      { params: filters },
    );

    return response.data;
  },

  async listPublishedItems(
    filters: PublishedItemsCatalogFilters,
  ): Promise<ItemCatalogPage<PublishedItemCatalogListItem>> {
    const response = await httpClient.get<ItemCatalogPage<PublishedItemCatalogListItem>>(
      `${itemCatalogBasePath}/public-items`,
      { params: filters },
    );

    return response.data;
  },

  async updatePublishedItem(
    itemTemplateId: string,
    payload: UpdatePublishedItemPayload,
  ): Promise<ItemTemplateDetails> {
    const response = await httpClient.patch<ItemTemplateDetails>(
      `${itemCatalogBasePath}/public-items/${itemTemplateId}`,
      payload,
    );

    return response.data;
  },
} as const;
