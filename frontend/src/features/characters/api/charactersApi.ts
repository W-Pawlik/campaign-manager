import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignCharacterListItem } from "@/features/campaigns";
import type {
  CampaignCharacterDetails,
  CreateCharacterPayload,
  UpdateCharacterPayload,
} from "@/features/characters/model/character.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const charactersApi = {
  async archiveCharacter(campaignId: string, characterId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/characters/${characterId}/archive`);
  },

  async createCharacter(
    campaignId: string,
    payload: CreateCharacterPayload,
  ): Promise<CampaignCharacterDetails> {
    const response = await httpClient.post<CampaignCharacterDetails>(
      `${campaignsBasePath}/${campaignId}/characters`,
      payload,
    );

    return response.data;
  },

  async deleteCharacter(campaignId: string, characterId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/characters/${characterId}`);
  },

  async getCharacterDetails(
    campaignId: string,
    characterId: string,
  ): Promise<CampaignCharacterDetails> {
    const response = await httpClient.get<CampaignCharacterDetails>(
      `${campaignsBasePath}/${campaignId}/characters/${characterId}`,
    );

    return response.data;
  },

  async listCampaignCharacters(campaignId: string): Promise<CampaignCharacterListItem[]> {
    const response = await httpClient.get<CampaignCharacterListItem[]>(
      `${campaignsBasePath}/${campaignId}/characters`,
    );

    return response.data;
  },

  async updateCharacter(
    campaignId: string,
    characterId: string,
    payload: UpdateCharacterPayload,
  ): Promise<CampaignCharacterDetails> {
    const response = await httpClient.patch<CampaignCharacterDetails>(
      `${campaignsBasePath}/${campaignId}/characters/${characterId}`,
      payload,
    );

    return response.data;
  },
} as const;
