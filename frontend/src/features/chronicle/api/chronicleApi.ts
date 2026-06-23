import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignChronicleEntry } from "@/features/campaigns";
import type {
  CreateChronicleEntryPayload,
  UpdateChronicleEntryPayload,
} from "@/features/chronicle/model/chronicle.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const chronicleApi = {
  async createChronicleEntry(
    campaignId: string,
    payload: CreateChronicleEntryPayload,
  ): Promise<CampaignChronicleEntry> {
    const response = await httpClient.post<CampaignChronicleEntry>(
      `${campaignsBasePath}/${campaignId}/chronicle`,
      payload,
    );

    return response.data;
  },

  async deleteChronicleEntry(campaignId: string, entryId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/chronicle/${entryId}`);
  },

  async getChronicleEntryDetails(campaignId: string, entryId: string): Promise<CampaignChronicleEntry> {
    const response = await httpClient.get<CampaignChronicleEntry>(
      `${campaignsBasePath}/${campaignId}/chronicle/${entryId}`,
    );

    return response.data;
  },

  async updateChronicleEntry(
    campaignId: string,
    entryId: string,
    payload: UpdateChronicleEntryPayload,
  ): Promise<CampaignChronicleEntry> {
    const response = await httpClient.patch<CampaignChronicleEntry>(
      `${campaignsBasePath}/${campaignId}/chronicle/${entryId}`,
      payload,
    );

    return response.data;
  },
} as const;
