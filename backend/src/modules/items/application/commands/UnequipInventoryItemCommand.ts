import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface UnequipInventoryItemInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
}

export class UnequipInventoryItemCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: UnequipInventoryItemInput) {}
}
