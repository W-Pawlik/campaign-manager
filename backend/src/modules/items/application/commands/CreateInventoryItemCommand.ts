import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface CreateInventoryItemInput {
  campaignId: string;
  actorUserId: string;
  itemTemplateId?: string | null;
  name?: string;
  description?: string | null;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isEquipped?: boolean;
  isAttuned?: boolean;
  isIdentified?: boolean;
  ownerType: string;
  ownerId: string;
  visibility?: string;
  customProperties?: unknown | null;
}

export class CreateInventoryItemCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: CreateInventoryItemInput) {}
}
