import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type {
  CampaignInvitation,
  CampaignMember,
} from "@/features/campaigns/model/campaign.types";
import type {
  InviteCampaignMemberPayload,
  UpdateCampaignMemberPayload,
} from "@/features/members/model/member.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const membersApi = {
  async acceptCampaignInvitation(campaignId: string, invitationId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/invitations/${invitationId}/accept`);
  },

  async declineCampaignInvitation(campaignId: string, invitationId: string): Promise<void> {
    await httpClient.post(`${campaignsBasePath}/${campaignId}/invitations/${invitationId}/decline`);
  },

  async inviteCampaignMember(
    campaignId: string,
    payload: InviteCampaignMemberPayload,
  ): Promise<CampaignInvitation> {
    const response = await httpClient.post<CampaignInvitation>(
      `${campaignsBasePath}/${campaignId}/members/invite`,
      payload,
    );

    return response.data;
  },

  async listCampaignInvitations(campaignId: string): Promise<CampaignInvitation[]> {
    const response = await httpClient.get<CampaignInvitation[]>(
      `${campaignsBasePath}/${campaignId}/invitations`,
    );

    return response.data;
  },

  async listCampaignMembers(campaignId: string): Promise<CampaignMember[]> {
    const response = await httpClient.get<CampaignMember[]>(`${campaignsBasePath}/${campaignId}/members`);

    return response.data;
  },

  async removeCampaignMember(campaignId: string, memberId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/members/${memberId}`);
  },

  async updateCampaignMember(
    campaignId: string,
    memberId: string,
    payload: UpdateCampaignMemberPayload,
  ): Promise<void> {
    await httpClient.patch(`${campaignsBasePath}/${campaignId}/members/${memberId}`, payload);
  },
} as const;
