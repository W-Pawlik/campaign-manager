import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignQuestListItem } from "@/features/campaigns";
import type {
  CampaignQuestDetails,
  CreateQuestObjectivePayload,
  CreateQuestPayload,
  QuestObjective,
  UpdateQuestObjectivePayload,
  UpdateQuestPayload,
} from "@/features/quests/model/quest.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const questsApi = {
  async addQuestObjective(
    campaignId: string,
    questId: string,
    payload: CreateQuestObjectivePayload,
  ): Promise<QuestObjective> {
    const response = await httpClient.post<QuestObjective>(
      `${campaignsBasePath}/${campaignId}/quests/${questId}/objectives`,
      payload,
    );

    return response.data;
  },

  async createQuest(campaignId: string, payload: CreateQuestPayload): Promise<CampaignQuestDetails> {
    const response = await httpClient.post<CampaignQuestDetails>(
      `${campaignsBasePath}/${campaignId}/quests`,
      payload,
    );

    return response.data;
  },

  async deleteQuest(campaignId: string, questId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/quests/${questId}`);
  },

  async deleteQuestObjective(
    campaignId: string,
    questId: string,
    objectiveId: string,
  ): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/quests/${questId}/objectives/${objectiveId}`);
  },

  async getQuestDetails(campaignId: string, questId: string): Promise<CampaignQuestDetails> {
    const response = await httpClient.get<CampaignQuestDetails>(
      `${campaignsBasePath}/${campaignId}/quests/${questId}`,
    );

    return response.data;
  },

  async listCampaignQuests(campaignId: string): Promise<CampaignQuestListItem[]> {
    const response = await httpClient.get<CampaignQuestListItem[]>(
      `${campaignsBasePath}/${campaignId}/quests`,
    );

    return response.data;
  },

  async updateQuest(
    campaignId: string,
    questId: string,
    payload: UpdateQuestPayload,
  ): Promise<CampaignQuestDetails> {
    const response = await httpClient.patch<CampaignQuestDetails>(
      `${campaignsBasePath}/${campaignId}/quests/${questId}`,
      payload,
    );

    return response.data;
  },

  async updateQuestObjective(
    campaignId: string,
    questId: string,
    objectiveId: string,
    payload: UpdateQuestObjectivePayload,
  ): Promise<QuestObjective> {
    const response = await httpClient.patch<QuestObjective>(
      `${campaignsBasePath}/${campaignId}/quests/${questId}/objectives/${objectiveId}`,
      payload,
    );

    return response.data;
  },
} as const;
