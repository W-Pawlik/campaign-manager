import type { Command } from "@core/application/cqrs/Command";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";

export interface ImportOpen5eItemToInventoryInput {
  campaignId: string;
  actorUserId: string;
  resourceType: string;
  resourceKey?: string;
  externalReferenceId?: string | null;
  nameOverride?: string;
  quantity?: number;
  charges?: number | null;
  maxCharges?: number | null;
  isAttuned?: boolean;
  isIdentified?: boolean;
  ownerType: string;
  ownerId: string;
  visibility?: string;
  customProperties?: unknown | null;
}

export class ImportOpen5eItemToInventoryCommand implements Command<InventoryItemDTO> {
  public constructor(public readonly input: ImportOpen5eItemToInventoryInput) {}
}
