import type { Query } from "@core/application/cqrs/Query";
import type { Open5eItemCatalogPageDTO } from "@modules/external-references/application/dto/Open5eItemCatalogPageDTO";

export interface ListOpen5eItemCatalogInput {
  actorUserId: string;
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
  search?: string;
  documentKey?: string;
  ordering?: string;
  limit?: number;
  page?: number;
}

export class ListOpen5eItemCatalogQuery implements Query<Open5eItemCatalogPageDTO> {
  public constructor(public readonly input: ListOpen5eItemCatalogInput) {}
}
