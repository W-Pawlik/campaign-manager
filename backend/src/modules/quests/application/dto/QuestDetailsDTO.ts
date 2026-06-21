import type { QuestListItemDTO } from "@modules/quests/application/dto/QuestListItemDTO";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";
import type { QuestRelationDTO } from "@modules/quests/application/dto/QuestRelationDTO";

export interface QuestPlayerViewDTO extends QuestListItemDTO {
  objectives: QuestObjectiveDTO[];
  relations: QuestRelationDTO[];
}

export interface QuestGmViewDTO extends QuestPlayerViewDTO {
  gmNotes: string | null;
  createdById: string;
}

export type QuestDetailsDTO = QuestPlayerViewDTO | QuestGmViewDTO;
