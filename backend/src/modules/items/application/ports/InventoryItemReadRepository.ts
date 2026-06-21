import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import type { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";

export interface InventoryItemReadRepository {
  listCampaignInventory(campaignId: string): Promise<InventoryItem[]>;
  getInventoryItemDetails(campaignId: string, itemId: string): Promise<InventoryItem | null>;
  listOwnerInventory(campaignId: string, ownerType: InventoryOwnerType, ownerId: string): Promise<InventoryItem[]>;
}
