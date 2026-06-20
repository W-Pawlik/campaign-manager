import type { Query } from "@core/application/cqrs/Query";
import type { SessionListItemDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";

export interface ListCampaignSessionsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignSessionsQuery implements Query<SessionListItemDTO[]> {
  public constructor(public readonly input: ListCampaignSessionsInput) {}
}
