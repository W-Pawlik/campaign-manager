import type { Command } from "@core/application/cqrs/Command";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";

export interface ChangeQuestStatusInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
  status: string;
}

export class ChangeQuestStatusCommand implements Command<QuestDetailsDTO> {
  public constructor(public readonly input: ChangeQuestStatusInput) {}
}
