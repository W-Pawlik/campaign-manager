import type { Query } from "@core/application/cqrs/Query";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface ListOwnerInventoryInput {
  campaignId: string;
  ownerType: string;
  ownerId: string;
  actorUserId: string;
}

export class ListOwnerInventoryQuery implements Query<InventoryItemDTO[]> {
  public constructor(public readonly input: ListOwnerInventoryInput) {}
}
