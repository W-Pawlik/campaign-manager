import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface UpdateInventoryItemInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
  name?: string;
  type?: string;
  rarity?: string | null;
  isMagical?: boolean;
  description?: string | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isAttuned?: boolean;
  isIdentified?: boolean;
  visibility?: string;
  customProperties?: unknown | null;
}

export class UpdateInventoryItemCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: UpdateInventoryItemInput) {}
}
