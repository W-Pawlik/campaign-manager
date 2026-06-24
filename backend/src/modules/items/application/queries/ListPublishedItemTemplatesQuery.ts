import type { Query } from "@core/application/cqrs/Query";
import type { ItemTemplateCatalogPageDTO } from "@modules/items/application/dto/ItemTemplateCatalogPageDTO";

export interface ListPublishedItemTemplatesInput {
  actorUserId: string;
  search?: string;
  type?: string;
  rarity?: string;
  isMagical?: boolean;
  limit?: number;
  page?: number;
}

export class ListPublishedItemTemplatesQuery implements Query<ItemTemplateCatalogPageDTO> {
  public constructor(public readonly input: ListPublishedItemTemplatesInput) {}
}
