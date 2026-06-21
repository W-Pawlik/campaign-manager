import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import type { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";

export interface QuestRepository {
  findById(campaignId: string, questId: string): Promise<Quest | null>;
  create(quest: Quest): Promise<void>;
  save(quest: Quest): Promise<void>;
  createObjective(objective: QuestObjective): Promise<void>;
  findObjectiveById(questId: string, objectiveId: string): Promise<QuestObjective | null>;
  saveObjective(objective: QuestObjective): Promise<void>;
  deleteObjective(questId: string, objectiveId: string): Promise<void>;
  createRelation(relation: QuestRelation): Promise<void>;
  deleteRelation(questId: string, relationId: string): Promise<void>;
}
