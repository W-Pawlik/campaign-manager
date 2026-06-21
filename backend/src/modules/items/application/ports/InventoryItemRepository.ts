import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";

export interface InventoryItemRepository {
  findById(campaignId: string, itemId: string): Promise<InventoryItem | null>;
  create(item: InventoryItem): Promise<void>;
  save(item: InventoryItem): Promise<void>;
}
