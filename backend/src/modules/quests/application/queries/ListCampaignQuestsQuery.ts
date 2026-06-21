import type { Query } from "@core/application/cqrs/Query";
import type { QuestListItemDTO } from "@modules/quests/application/dto/QuestListItemDTO";

export interface ListCampaignQuestsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignQuestsQuery implements Query<QuestListItemDTO[]> {
  public constructor(public readonly input: ListCampaignQuestsInput) {}
}
