import type { PrismaClient } from "@prisma/client";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import type { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import type { InventoryItemPersistenceRecord, ItemMapper } from "@modules/items/infrastructure/persistence/ItemMapper";

interface InventoryItemReadDelegate {
  findMany(args: unknown): Promise<InventoryItemPersistenceRecord[]>;
  findFirst(args: unknown): Promise<InventoryItemPersistenceRecord | null>;
}

export class PrismaInventoryItemReadRepository implements InventoryItemReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ItemMapper,
  ) {}

  public async listCampaignInventory(campaignId: string): Promise<InventoryItem[]> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemReadDelegate };
    const items = await inventoryItemClient.inventoryItem.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      orderBy: [
        { updatedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return items.map((item) => this.mapper.toInventoryDomain(item as InventoryItemPersistenceRecord));
  }

  public async getInventoryItemDetails(campaignId: string, itemId: string): Promise<InventoryItem | null> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemReadDelegate };
    const item = await inventoryItemClient.inventoryItem.findFirst({
      where: {
        id: itemId,
        campaignId,
        deletedAt: null,
      },
    });

    return item === null ? null : this.mapper.toInventoryDomain(item as InventoryItemPersistenceRecord);
  }

  public async listOwnerInventory(
    campaignId: string,
    ownerType: InventoryOwnerType,
    ownerId: string,
  ): Promise<InventoryItem[]> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemReadDelegate };
    const items = await inventoryItemClient.inventoryItem.findMany({
      where: {
        campaignId,
        ownerType: ownerType.value,
        ownerId,
        deletedAt: null,
      },
      orderBy: [
        { isEquipped: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return items.map((item) => this.mapper.toInventoryDomain(item as InventoryItemPersistenceRecord));
  }
}
