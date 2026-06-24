import type { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";

export interface ListPublishedItemTemplatesFilters {
  search?: string;
  type?: string;
  rarity?: string;
  isMagical?: boolean;
  limit: number;
  page: number;
}

export interface ItemTemplatePageResult {
  items: ItemTemplate[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}

export interface ItemTemplateRepository {
  findById(templateId: string): Promise<ItemTemplate | null>;
  listPublished(filters: ListPublishedItemTemplatesFilters): Promise<ItemTemplatePageResult>;
  create(template: ItemTemplate): Promise<void>;
  save(template: ItemTemplate): Promise<void>;
}
