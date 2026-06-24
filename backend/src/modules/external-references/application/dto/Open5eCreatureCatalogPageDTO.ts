import type { Open5eCreatureCatalogListItemDTO } from "@modules/external-references/application/dto/Open5eCreatureCatalogListItemDTO";

export interface Open5eCreatureCatalogPageDTO {
  items: Open5eCreatureCatalogListItemDTO[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}
