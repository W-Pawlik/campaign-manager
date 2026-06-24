import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type {
  AddCatalogMonsterToCampaignPayload,
  CampaignMonsterDetails,
  CampaignMonsterListItem,
  CreateMonsterPayload,
  CreatePublishedMonsterPayload,
  MonsterCatalogPage,
  Open5eCatalogCreatureListItem,
  Open5eCatalogFilters,
  Open5eResourceDetails,
  PublishedMonsterCatalogFilters,
  PublishedMonsterCatalogListItem,
  UpdateMonsterPayload,
} from "@/features/monsters/model/monster.types";

const campaignsBasePath = apiEndpoints.campaigns.base;
const monsterCatalogBasePath = "/monster-catalog";

export const monstersApi = {
  async archiveMonster(campaignId: string, monsterId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/monsters/${monsterId}/archive`);
  },

  async copyOpen5eCreatureToCampaign(
    key: string,
    payload: AddCatalogMonsterToCampaignPayload,
  ): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${monsterCatalogBasePath}/providers/open5e/creatures/${key}/copy-to-campaign`,
      payload,
    );

    return response.data;
  },

  async copyPublishedMonsterToCampaign(
    monsterId: string,
    payload: AddCatalogMonsterToCampaignPayload,
  ): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${monsterCatalogBasePath}/public-monsters/${monsterId}/copy-to-campaign`,
      payload,
    );

    return response.data;
  },

  async createMonster(campaignId: string, payload: CreateMonsterPayload): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${campaignsBasePath}/${campaignId}/monsters`,
      payload,
    );

    return response.data;
  },

  async createPublishedMonster(
    payload: CreatePublishedMonsterPayload,
  ): Promise<CampaignMonsterDetails> {
    const response = await httpClient.post<CampaignMonsterDetails>(
      `${monsterCatalogBasePath}/public-monsters`,
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

  async getOpen5eCreatureDetails(key: string): Promise<Open5eResourceDetails> {
    const response = await httpClient.get<Open5eResourceDetails>(
      `${monsterCatalogBasePath}/providers/open5e/creatures/${key}`,
    );

    return response.data;
  },

  async getPublishedMonsterDetails(monsterId: string): Promise<CampaignMonsterDetails> {
    const response = await httpClient.get<CampaignMonsterDetails>(
      `${monsterCatalogBasePath}/public-monsters/${monsterId}`,
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

  async listOpen5eCatalogCreatures(
    filters: Open5eCatalogFilters,
  ): Promise<MonsterCatalogPage<Open5eCatalogCreatureListItem>> {
    const response = await httpClient.get<MonsterCatalogPage<Open5eCatalogCreatureListItem>>(
      `${monsterCatalogBasePath}/providers/open5e/creatures`,
      {
        params: filters,
      },
    );

    return response.data;
  },

  async listPublishedMonsters(
    filters: PublishedMonsterCatalogFilters,
  ): Promise<MonsterCatalogPage<PublishedMonsterCatalogListItem>> {
    const response = await httpClient.get<MonsterCatalogPage<PublishedMonsterCatalogListItem>>(
      `${monsterCatalogBasePath}/public-monsters`,
      {
        params: filters,
      },
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
