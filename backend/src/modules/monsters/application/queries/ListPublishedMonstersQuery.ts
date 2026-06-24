import type { Query } from "@core/application/cqrs/Query";
import type { MonsterCatalogPageDTO } from "@modules/monsters/application/dto/MonsterCatalogPageDTO";

export interface ListPublishedMonstersInput {
  actorUserId: string;
  search?: string;
  type?: string;
  minCr?: number;
  maxCr?: number;
  limit?: number;
  page?: number;
}

export class ListPublishedMonstersQuery
  implements Query<MonsterCatalogPageDTO>
{
  public constructor(public readonly input: ListPublishedMonstersInput) {}
}
