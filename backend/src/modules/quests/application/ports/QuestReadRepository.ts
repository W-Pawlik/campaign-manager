import type { QuestDetailsReadModel } from "@modules/quests/application/dto/QuestDetailsReadModel";
import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";

export interface QuestReadRepository {
  listCampaignQuests(campaignId: string): Promise<Quest[]>;
  getQuestDetails(campaignId: string, questId: string): Promise<QuestDetailsReadModel | null>;
  listQuestObjectives(campaignId: string, questId: string): Promise<QuestObjective[]>;
}
