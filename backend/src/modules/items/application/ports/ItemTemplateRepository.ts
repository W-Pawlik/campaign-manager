import type { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";

export interface ItemTemplateRepository {
  findById(templateId: string): Promise<ItemTemplate | null>;
  create(template: ItemTemplate): Promise<void>;
}
