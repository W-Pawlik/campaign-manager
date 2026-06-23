import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignSessionListItem } from "@/features/campaigns";
import type {
  CampaignSessionDetails,
  CreateSessionPayload,
  UpdateSessionPayload,
} from "@/features/sessions/model/session.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const sessionsApi = {
  async cancelSession(campaignId: string, sessionId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/sessions/${sessionId}`);
  },

  async completeSession(campaignId: string, sessionId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/sessions/${sessionId}/complete`);
  },

  async confirmSessionAttendance(campaignId: string, sessionId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/sessions/${sessionId}/confirm`);
  },

  async createSession(
    campaignId: string,
    payload: CreateSessionPayload,
  ): Promise<CampaignSessionDetails> {
    const response = await httpClient.post<CampaignSessionDetails>(
      `${campaignsBasePath}/${campaignId}/sessions`,
      payload,
    );

    return response.data;
  },

  async declineSessionAttendance(campaignId: string, sessionId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/sessions/${sessionId}/decline`);
  },

  async getSessionDetails(campaignId: string, sessionId: string): Promise<CampaignSessionDetails> {
    const response = await httpClient.get<CampaignSessionDetails>(
      `${campaignsBasePath}/${campaignId}/sessions/${sessionId}`,
    );

    return response.data;
  },

  async listCampaignSessions(campaignId: string): Promise<CampaignSessionListItem[]> {
    const response = await httpClient.get<CampaignSessionListItem[]>(
      `${campaignsBasePath}/${campaignId}/sessions`,
    );

    return response.data;
  },

  async updateSession(
    campaignId: string,
    sessionId: string,
    payload: UpdateSessionPayload,
  ): Promise<CampaignSessionDetails> {
    const response = await httpClient.patch<CampaignSessionDetails>(
      `${campaignsBasePath}/${campaignId}/sessions/${sessionId}`,
      payload,
    );

    return response.data;
  },
} as const;
