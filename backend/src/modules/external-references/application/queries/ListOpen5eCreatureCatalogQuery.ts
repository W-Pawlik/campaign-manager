import type { Query } from "@core/application/cqrs/Query";
import type { Open5eCreatureCatalogPageDTO } from "@modules/external-references/application/dto/Open5eCreatureCatalogPageDTO";

export interface ListOpen5eCreatureCatalogInput {
  actorUserId: string;
  search?: string;
  type?: string;
  documentKey?: string;
  minCr?: number;
  maxCr?: number;
  ordering?: string;
  limit?: number;
  page?: number;
}

export class ListOpen5eCreatureCatalogQuery
  implements Query<Open5eCreatureCatalogPageDTO>
{
  public constructor(public readonly input: ListOpen5eCreatureCatalogInput) {}
}
