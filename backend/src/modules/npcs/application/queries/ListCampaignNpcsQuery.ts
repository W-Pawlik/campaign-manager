import type { Query } from "@core/application/cqrs/Query";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";

export interface ListCampaignNpcsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignNpcsQuery implements Query<NpcViewDTO[]> {
  public constructor(public readonly input: ListCampaignNpcsInput) {}
}
