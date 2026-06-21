import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface EquipInventoryItemInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
}

export class EquipInventoryItemCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: EquipInventoryItemInput) {}
}
