import type { Query } from "@core/application/cqrs/Query";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";

export interface ListUserCampaignsInput {
  userId: string;
}

export class ListUserCampaignsQuery implements Query<CampaignListItemDTO[]> {
  public constructor(public readonly input: ListUserCampaignsInput) {}
}