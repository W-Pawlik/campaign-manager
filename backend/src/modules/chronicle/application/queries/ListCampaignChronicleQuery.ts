import type { Query } from "@core/application/cqrs/Query";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";

export interface ListCampaignChronicleInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignChronicleQuery implements Query<ChronicleEntryDTO[]> {
  public constructor(public readonly input: ListCampaignChronicleInput) {}
}
