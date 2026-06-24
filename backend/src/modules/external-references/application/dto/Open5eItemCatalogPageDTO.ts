import type { Open5eItemCatalogListItemDTO } from "@modules/external-references/application/dto/Open5eItemCatalogListItemDTO";

export interface Open5eItemCatalogPageDTO {
  items: Open5eItemCatalogListItemDTO[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}
