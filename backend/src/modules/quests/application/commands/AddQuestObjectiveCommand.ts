import type { Command } from "@core/application/cqrs/Command";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";

export interface AddQuestObjectiveInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
  title: string;
  description?: string | null;
  status?: string;
  sortOrder?: number;
}

export class AddQuestObjectiveCommand implements Command<QuestObjectiveDTO> {
  public constructor(public readonly input: AddQuestObjectiveInput) {}
}
