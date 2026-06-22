import type { Query } from "@core/application/cqrs/Query";
import type { MonsterListItemDTO } from "@modules/monsters/application/dto/MonsterListItemDTO";

export interface ListCampaignMonstersInput {
  campaignId: string;
  actorUserId: string;
  includeGlobal?: boolean;
  search?: string;
  type?: string;
  minCr?: number;
  maxCr?: number;
  status?: string;
}

export class ListCampaignMonstersQuery implements Query<MonsterListItemDTO[]> {
  public constructor(public readonly input: ListCampaignMonstersInput) {}
}
