import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type {
  CampaignMonsterDetails,
  CampaignMonsterListItem,
  CreateMonsterPayload,
  ImportOpen5eMonsterPayload,
  Open5eResourceDetails,
  Open5eSearchResult,
  UpdateMonsterPayload,
} from "@/features/monsters/model/monster.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const monstersApi = {
  async archiveMonster(campaignId: string, monsterId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/monsters/${monsterId}/archive`);
  },

  async createMonster(campaignId: string, payload: CreateMonsterPayload): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${campaignsBasePath}/${campaignId}/monsters`,
      payload,
    );

    return response.data;
  },

  async getMonsterDetails(campaignId: string, monsterId: string): Promise<CampaignMonsterDetails> {
    const response = await httpClient.get<CampaignMonsterDetails>(
      `${campaignsBasePath}/${campaignId}/monsters/${monsterId}`,
    );

    return response.data;
  },

  async importOpen5eMonster(
    campaignId: string,
    payload: ImportOpen5eMonsterPayload,
  ): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${campaignsBasePath}/${campaignId}/monsters/import-open5e`,
      payload,
    );

    return response.data;
  },

  async listCampaignMonsters(
    campaignId: string,
    filters?: {
      includeGlobal?: boolean;
      maxCr?: number;
      minCr?: number;
      search?: string;
      status?: string;
      type?: string;
    },
  ): Promise<CampaignMonsterListItem[]> {
    const response = await httpClient.get<CampaignMonsterListItem[]>(
      `${campaignsBasePath}/${campaignId}/monsters`,
      { params: filters },
    );

    return response.data;
  },

  async searchOpen5eResources(input: {
    limit?: number;
    page?: number;
    query: string;
    resourceType?: string;
  }): Promise<Open5eSearchResult[]> {
    const response = await httpClient.get<Open5eSearchResult[]>("/external/open5e/search", {
      params: input,
    });

    return response.data;
  },

  async getOpen5eResourceDetails(resourceType: string, key: string): Promise<Open5eResourceDetails> {
    const response = await httpClient.get<Open5eResourceDetails>(
      `/external/open5e/resources/${resourceType}/${key}`,
    );

    return response.data;
  },

  async updateMonster(
    campaignId: string,
    monsterId: string,
    payload: UpdateMonsterPayload,
  ): Promise<CampaignMonsterDetails> {
    const response = await httpClient.patch<CampaignMonsterDetails>(
      `${campaignsBasePath}/${campaignId}/monsters/${monsterId}`,
      payload,
    );

    return response.data;
  },
} as const;
