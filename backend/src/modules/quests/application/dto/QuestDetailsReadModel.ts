import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import type { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";

export interface QuestDetailsReadModel {
  quest: Quest;
  objectives: QuestObjective[];
  relations: QuestRelation[];
}
