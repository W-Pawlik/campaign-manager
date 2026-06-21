import type { PrismaClient } from "@prisma/client";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import type { InventoryItemPersistenceRecord, ItemMapper } from "@modules/items/infrastructure/persistence/ItemMapper";

interface InventoryItemDelegate {
  findFirst(args: unknown): Promise<InventoryItemPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaInventoryItemRepository implements InventoryItemRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ItemMapper,
  ) {}

  public async findById(campaignId: string, itemId: string): Promise<InventoryItem | null> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemDelegate };
    const item = await inventoryItemClient.inventoryItem.findFirst({
      where: {
        id: itemId,
        campaignId,
        deletedAt: null,
      },
    });

    return item === null ? null : this.mapper.toInventoryDomain(item);
  }

  public async create(item: InventoryItem): Promise<void> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemDelegate };
    await inventoryItemClient.inventoryItem.create({
      data: this.mapper.inventoryToPersistenceCreate(item),
    });
  }

  public async save(item: InventoryItem): Promise<void> {
    const inventoryItemClient = this.prismaClient as PrismaClient & { inventoryItem: InventoryItemDelegate };
    await inventoryItemClient.inventoryItem.update({
      where: { id: item.id },
      data: this.mapper.inventoryToPersistenceUpdate(item),
    });
  }
}
