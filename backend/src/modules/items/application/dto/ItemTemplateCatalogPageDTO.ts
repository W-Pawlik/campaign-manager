import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";

export interface ItemTemplateCatalogPageDTO {
  items: ItemTemplateDTO[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}
