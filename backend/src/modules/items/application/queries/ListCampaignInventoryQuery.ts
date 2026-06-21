import type { Query } from "@core/application/cqrs/Query";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface ListCampaignInventoryInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignInventoryQuery implements Query<InventoryItemDTO[]> {
  public constructor(public readonly input: ListCampaignInventoryInput) {}
}
