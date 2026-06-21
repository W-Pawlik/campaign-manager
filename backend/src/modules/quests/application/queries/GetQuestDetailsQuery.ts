import type { Query } from "@core/application/cqrs/Query";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";

export interface GetQuestDetailsInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
}

export class GetQuestDetailsQuery implements Query<QuestDetailsDTO> {
  public constructor(public readonly input: GetQuestDetailsInput) {}
}
