import { describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { GetInventoryItemDetailsHandler } from "@modules/items/application/handlers/GetInventoryItemDetailsHandler";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import { GetInventoryItemDetailsQuery } from "@modules/items/application/queries/GetInventoryItemDetailsQuery";
import { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryVisibilityApplicationService } from "@modules/items/application/services/InventoryVisibilityApplicationService";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

function createAccessService(role: CampaignRole): CampaignAccessApplicationService {
  return {
    requirePermission: vi.fn(),
    requireMembership: vi.fn().mockResolvedValue({ role }),
  } as unknown as CampaignAccessApplicationService;
}

function createOwnerService(characterOwnerUserId: string): InventoryOwnerApplicationService {
  return new InventoryOwnerApplicationService(
    {
      findById: vi.fn().mockResolvedValue({ ownerUserId: characterOwnerUserId }),
      create: vi.fn(),
      save: vi.fn(),
    },
    { findById: vi.fn(), create: vi.fn(), save: vi.fn() },
    { findById: vi.fn(), create: vi.fn(), save: vi.fn() },
    { findById: vi.fn(), create: vi.fn(), save: vi.fn(), createObjective: vi.fn(), findObjectiveById: vi.fn(), saveObjective: vi.fn(), deleteObjective: vi.fn(), createRelation: vi.fn(), deleteRelation: vi.fn() },
    { findById: vi.fn(), create: vi.fn(), save: vi.fn() },
  ) as unknown as InventoryOwnerApplicationService;
}

function createReadRepository(item: InventoryItem): InventoryItemReadRepository {
  return {
    listCampaignInventory: vi.fn(),
    getInventoryItemDetails: vi.fn().mockResolvedValue(item),
    listOwnerInventory: vi.fn(),
  };
}

function createItem(visibility: ItemVisibility): InventoryItem {
  return InventoryItem.create({
    id: "item-1",
    campaignId: "campaign-1",
    itemTemplateId: null,
    source: "CUSTOM",
    externalReferenceId: null,
    name: "Hidden letter",
    type: "OTHER",
    rarity: null,
    isMagical: false,
    description: null,
    weight: null,
    valueAmount: null,
    valueCurrency: null,
    quantity: 1,
    charges: null,
    maxCharges: null,
    isEquipped: false,
    isAttuned: false,
    isIdentified: true,
    ownerType: InventoryOwnerType.create("CHARACTER"),
    ownerId: "character-1",
    visibility,
    customProperties: null,
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
    deletedAt: null,
  });
}

describe("GetInventoryItemDetailsHandler", () => {
  it("returns owner-only item for character owner", async () => {
    const ownerService = createOwnerService("player-1");
    const visibilityService = new InventoryVisibilityApplicationService(
      new CampaignVisibilityApplicationService(new CampaignPermissionDomainService()),
      ownerService,
    );
    const handler = new GetInventoryItemDetailsHandler(
      createAccessService(CampaignRole.player()),
      createReadRepository(createItem(ItemVisibility.create("OWNER_ONLY"))),
      visibilityService,
    );

    const result = await handler.execute(
      new GetInventoryItemDetailsQuery({
        campaignId: "campaign-1",
        itemId: "item-1",
        actorUserId: "player-1",
      }),
    );

    expect(result.visibility).toBe("OWNER_ONLY");
  });

  it("hides GM-only item from player", async () => {
    const ownerService = createOwnerService("player-1");
    const visibilityService = new InventoryVisibilityApplicationService(
      new CampaignVisibilityApplicationService(new CampaignPermissionDomainService()),
      ownerService,
    );
    const handler = new GetInventoryItemDetailsHandler(
      createAccessService(CampaignRole.player()),
      createReadRepository(createItem(ItemVisibility.create("GM_ONLY"))),
      visibilityService,
    );

    await expect(
      handler.execute(
        new GetInventoryItemDetailsQuery({
          campaignId: "campaign-1",
          itemId: "item-1",
          actorUserId: "player-1",
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
