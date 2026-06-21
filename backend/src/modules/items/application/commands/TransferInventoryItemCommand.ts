import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface TransferInventoryItemInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
  targetOwnerType: string;
  targetOwnerId: string;
  quantity?: number;
}

export class TransferInventoryItemCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: TransferInventoryItemInput) {}
}
