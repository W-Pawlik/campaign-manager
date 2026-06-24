import type { Query } from "@core/application/cqrs/Query";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";

export interface GetPublishedItemTemplateDetailsInput {
  actorUserId: string;
  itemTemplateId: string;
}

export class GetPublishedItemTemplateDetailsQuery implements Query<ItemTemplateDTO> {
  public constructor(public readonly input: GetPublishedItemTemplateDetailsInput) {}
}
