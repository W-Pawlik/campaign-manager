import type { Query } from "@core/application/cqrs/Query";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface ListMyInventoryItemsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListMyInventoryItemsQuery implements Query<InventoryItemDTO[]> {
  public constructor(public readonly input: ListMyInventoryItemsInput) {}
}
