import type { Command } from "@core/application/cqrs/Command";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";

export interface UpdateQuestObjectiveInput {
  campaignId: string;
  questId: string;
  objectiveId: string;
  actorUserId: string;
  title?: string;
  description?: string | null;
  status?: string;
  sortOrder?: number;
}

export class UpdateQuestObjectiveCommand implements Command<QuestObjectiveDTO> {
  public constructor(public readonly input: UpdateQuestObjectiveInput) {}
}
