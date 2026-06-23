import { httpClient } from "@/core/api/httpClient";
import type {
  CampaignCharacterListItem,
  CampaignChronicleEntry,
  CampaignDetails,
  CampaignInvitation,
  CampaignListItem,
  CampaignLocationListItem,
  CampaignMember,
  CampaignNote,
  CampaignNpcListItem,
  CampaignQuestListItem,
  CampaignSessionListItem,
  CreateCampaignPayload,
} from "@/features/campaigns/model/campaign.types";

const campaignsBasePath = "/campaigns";

export const campaignsApi = {
  async createCampaign(payload: CreateCampaignPayload): Promise<CampaignDetails> {
    const response = await httpClient.post<CampaignDetails>(campaignsBasePath, payload);

    return response.data;
  },

  async getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    const response = await httpClient.get<CampaignDetails>(`${campaignsBasePath}/${campaignId}`);

    return response.data;
  },

  async listCampaignCharacters(campaignId: string): Promise<CampaignCharacterListItem[]> {
    const response = await httpClient.get<CampaignCharacterListItem[]>(
      `${campaignsBasePath}/${campaignId}/characters`,
    );

    return response.data;
  },

  async listCampaignChronicle(campaignId: string): Promise<CampaignChronicleEntry[]> {
    const response = await httpClient.get<CampaignChronicleEntry[]>(
      `${campaignsBasePath}/${campaignId}/chronicle`,
    );

    return response.data;
  },

  async listCampaignInvitations(campaignId: string): Promise<CampaignInvitation[]> {
    const response = await httpClient.get<CampaignInvitation[]>(
      `${campaignsBasePath}/${campaignId}/invitations`,
    );

    return response.data;
  },

  async listCampaignLocations(campaignId: string): Promise<CampaignLocationListItem[]> {
    const response = await httpClient.get<CampaignLocationListItem[]>(
      `${campaignsBasePath}/${campaignId}/locations`,
    );

    return response.data;
  },

  async listCampaignMembers(campaignId: string): Promise<CampaignMember[]> {
    const response = await httpClient.get<CampaignMember[]>(
      `${campaignsBasePath}/${campaignId}/members`,
    );

    return response.data;
  },

  async listCampaignNotes(campaignId: string): Promise<CampaignNote[]> {
    const response = await httpClient.get<CampaignNote[]>(`${campaignsBasePath}/${campaignId}/notes`);

    return response.data;
  },

  async listCampaignNpcs(campaignId: string): Promise<CampaignNpcListItem[]> {
    const response = await httpClient.get<CampaignNpcListItem[]>(`${campaignsBasePath}/${campaignId}/npcs`);

    return response.data;
  },

  async listCampaignQuests(campaignId: string): Promise<CampaignQuestListItem[]> {
    const response = await httpClient.get<CampaignQuestListItem[]>(
      `${campaignsBasePath}/${campaignId}/quests`,
    );

    return response.data;
  },

  async listCampaignSessions(campaignId: string): Promise<CampaignSessionListItem[]> {
    const response = await httpClient.get<CampaignSessionListItem[]>(
      `${campaignsBasePath}/${campaignId}/sessions`,
    );

    return response.data;
  },

  async listUserCampaigns(): Promise<CampaignListItem[]> {
    const response = await httpClient.get<CampaignListItem[]>(campaignsBasePath);

    return response.data;
  },
} as const;
