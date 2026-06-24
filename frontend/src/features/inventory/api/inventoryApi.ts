import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignInventoryListItem } from "@/features/campaigns";
import type {
  CreateInventoryItemPayload,
  InventoryItemDetails,
  TransferInventoryItemPayload,
  UpdateInventoryItemPayload,
} from "@/features/inventory/model/inventory.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const inventoryApi = {
  async createInventoryItem(
    campaignId: string,
    payload: CreateInventoryItemPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.post<InventoryItemDetails>(
      `${campaignsBasePath}/${campaignId}/inventory`,
      payload,
    );

    return response.data;
  },

  async deleteInventoryItem(campaignId: string, itemId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/inventory/${itemId}`);
  },

  async getInventoryItemDetails(campaignId: string, itemId: string): Promise<InventoryItemDetails> {
    const response = await httpClient.get<InventoryItemDetails>(
      `${campaignsBasePath}/${campaignId}/inventory/${itemId}`,
    );

    return response.data;
  },

  async listCampaignInventory(campaignId: string): Promise<CampaignInventoryListItem[]> {
    const response = await httpClient.get<CampaignInventoryListItem[]>(
      `${campaignsBasePath}/${campaignId}/inventory`,
    );

    return response.data;
  },

  async transferInventoryItem(
    campaignId: string,
    itemId: string,
    payload: TransferInventoryItemPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.post<InventoryItemDetails>(
      `${campaignsBasePath}/${campaignId}/inventory/${itemId}/transfer`,
      payload,
    );

    return response.data;
  },

  async updateInventoryItem(
    campaignId: string,
    itemId: string,
    payload: UpdateInventoryItemPayload,
  ): Promise<InventoryItemDetails> {
    const response = await httpClient.patch<InventoryItemDetails>(
      `${campaignsBasePath}/${campaignId}/inventory/${itemId}`,
      payload,
    );

    return response.data;
  },
} as const;
