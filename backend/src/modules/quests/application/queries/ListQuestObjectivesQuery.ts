import type { Query } from "@core/application/cqrs/Query";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";

export interface ListQuestObjectivesInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
}

export class ListQuestObjectivesQuery implements Query<QuestObjectiveDTO[]> {
  public constructor(public readonly input: ListQuestObjectivesInput) {}
}
