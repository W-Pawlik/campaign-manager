import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignNpcListItem } from "@/features/campaigns";
import type { CampaignNpcDetails, CreateNpcPayload, UpdateNpcPayload } from "@/features/npcs/model/npc.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const npcsApi = {
  async createNpc(campaignId: string, payload: CreateNpcPayload): Promise<CampaignNpcDetails> {
    const response = await httpClient.post<CampaignNpcDetails>(`${campaignsBasePath}/${campaignId}/npcs`, payload);

    return response.data;
  },

  async deleteNpc(campaignId: string, npcId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/npcs/${npcId}`);
  },

  async getNpcDetails(campaignId: string, npcId: string): Promise<CampaignNpcDetails> {
    const response = await httpClient.get<CampaignNpcDetails>(`${campaignsBasePath}/${campaignId}/npcs/${npcId}`);

    return response.data;
  },

  async listCampaignNpcs(campaignId: string): Promise<CampaignNpcListItem[]> {
    const response = await httpClient.get<CampaignNpcListItem[]>(`${campaignsBasePath}/${campaignId}/npcs`);

    return response.data;
  },

  async updateNpc(campaignId: string, npcId: string, payload: UpdateNpcPayload): Promise<CampaignNpcDetails> {
    const response = await httpClient.patch<CampaignNpcDetails>(
      `${campaignsBasePath}/${campaignId}/npcs/${npcId}`,
      payload,
    );

    return response.data;
  },
} as const;
