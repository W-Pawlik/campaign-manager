import type { Query } from "@core/application/cqrs/Query";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface GetInventoryItemDetailsInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
}

export class GetInventoryItemDetailsQuery implements Query<InventoryItemDTO> {
  public constructor(public readonly input: GetInventoryItemDetailsInput) {}
}
