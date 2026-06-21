import { describe, expect, it, vi } from "vitest";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { TransferInventoryItemCommand } from "@modules/items/application/commands/TransferInventoryItemCommand";
import { TransferInventoryItemHandler } from "@modules/items/application/handlers/TransferInventoryItemHandler";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

function createAccessService(): CampaignAccessApplicationService {
  return {
    requireMembership: vi.fn(),
    requirePermission: vi.fn().mockResolvedValue({ role: CampaignRole.player() }),
  } as unknown as CampaignAccessApplicationService;
}

function createOwnerService(): InventoryOwnerApplicationService {
  return {
    validateOwnerExists: vi.fn().mockResolvedValue(undefined),
    assertCanManageOwner: vi.fn().mockResolvedValue(undefined),
    canViewOwner: vi.fn(),
  } as unknown as InventoryOwnerApplicationService;
}

function createRepository(item: InventoryItem): InventoryItemRepository {
  return {
    findById: vi.fn().mockResolvedValue(item),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createItem(): InventoryItem {
  return InventoryItem.create({
    id: "item-1",
    campaignId: "campaign-1",
    itemTemplateId: null,
    name: "Healing Potion",
    description: null,
    quantity: 3,
    charges: null,
    maxCharges: null,
    isEquipped: false,
    isAttuned: false,
    isIdentified: true,
    ownerType: InventoryOwnerType.create("CHARACTER"),
    ownerId: "character-source",
    visibility: ItemVisibility.public(),
    customProperties: null,
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
    deletedAt: null,
  });
}

describe("TransferInventoryItemHandler", () => {
  it("splits stack and creates transferred item for partial transfer", async () => {
    const repository = createRepository(createItem());
    const handler = new TransferInventoryItemHandler(
      repository,
      createAccessService(),
      createOwnerService(),
    );

    const result = await handler.execute(
      new TransferInventoryItemCommand({
        campaignId: "campaign-1",
        itemId: "item-1",
        actorUserId: "player-1",
        targetOwnerType: "CHARACTER",
        targetOwnerId: "character-target",
        quantity: 2,
      }),
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.quantity).toBe(2);
    expect(result.ownerId).toBe("character-target");
  });
});
