import type { Command } from "@core/application/cqrs/Command";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";

export interface CreateItemTemplateInput {
  campaignId: string;
  actorUserId: string;
  source?: string;
  externalReferenceId?: string | null;
  name: string;
  type?: string;
  rarity?: string | null;
  description?: string | null;
  properties?: unknown | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
}

export class CreateItemTemplateCommand implements Command<ItemTemplateDTO> {
  public constructor(public readonly input: CreateItemTemplateInput) {}
}
