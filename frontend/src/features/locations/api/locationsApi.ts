import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignLocationListItem } from "@/features/campaigns";
import type { CampaignLocationDetails, CreateLocationPayload, UpdateLocationPayload } from "@/features/locations/model/location.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const locationsApi = {
  async createLocation(campaignId: string, payload: CreateLocationPayload): Promise<CampaignLocationDetails> {
    const response = await httpClient.post<CampaignLocationDetails>(
      `${campaignsBasePath}/${campaignId}/locations`,
      payload,
    );

    return response.data;
  },

  async deleteLocation(campaignId: string, locationId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/locations/${locationId}`);
  },

  async getLocationDetails(campaignId: string, locationId: string): Promise<CampaignLocationDetails> {
    const response = await httpClient.get<CampaignLocationDetails>(
      `${campaignsBasePath}/${campaignId}/locations/${locationId}`,
    );

    return response.data;
  },

  async listCampaignLocations(campaignId: string): Promise<CampaignLocationListItem[]> {
    const response = await httpClient.get<CampaignLocationListItem[]>(
      `${campaignsBasePath}/${campaignId}/locations`,
    );

    return response.data;
  },

  async updateLocation(
    campaignId: string,
    locationId: string,
    payload: UpdateLocationPayload,
  ): Promise<CampaignLocationDetails> {
    const response = await httpClient.patch<CampaignLocationDetails>(
      `${campaignsBasePath}/${campaignId}/locations/${locationId}`,
      payload,
    );

    return response.data;
  },
} as const;
