import type { Command } from "@core/application/cqrs/Command";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";

export interface UpdateItemTemplateInput {
  itemTemplateId: string;
  actorUserId: string;
  name?: string;
  type?: string;
  rarity?: string | null;
  isMagical?: boolean;
  description?: string | null;
  properties?: unknown | null;
  weight?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
}

export class UpdateItemTemplateCommand implements Command<ItemTemplateDTO> {
  public constructor(public readonly input: UpdateItemTemplateInput) {}
}
