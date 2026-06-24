import { describe, expect, it, vi } from "vitest";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";
import { ImportOpen5eItemToInventoryCommand } from "@modules/items/application/commands/ImportOpen5eItemToInventoryCommand";
import { ImportOpen5eItemToInventoryHandler } from "@modules/items/application/handlers/ImportOpen5eItemToInventoryHandler";
import { ListMyInventoryItemsHandler } from "@modules/items/application/handlers/ListMyInventoryItemsHandler";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import { ListMyInventoryItemsQuery } from "@modules/items/application/queries/ListMyInventoryItemsQuery";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

function createAccessService(): CampaignAccessApplicationService {
  return {
    requireMembership: vi.fn().mockResolvedValue({ role: CampaignRole.player() }),
    requirePermission: vi.fn(),
  } as unknown as CampaignAccessApplicationService;
}

function createOwnerService(): InventoryOwnerApplicationService {
  return {
    validateOwnerExists: vi.fn().mockResolvedValue(undefined),
    assertCanManageOwner: vi.fn().mockResolvedValue(undefined),
    canViewOwner: vi.fn(),
  } as unknown as InventoryOwnerApplicationService;
}

function createExternalReference(): ExternalReference {
  return ExternalReference.create({
    id: "external-reference-1",
    provider: ExternalProvider.open5e(),
    resourceType: ExternalResourceType.create("MAGIC_ITEM"),
    externalId: null,
    key: "wand-of-smiles",
    slug: "wand-of-smiles",
    url: "https://api.open5e.com/v2/magicitems/wand-of-smiles/",
    name: "Wand of Smiles",
    sourceDocumentKey: "srd-2024",
    sourceDocumentName: "SRD 2024",
    rawData: {},
    normalizedData: {
      name: "Wand of Smiles",
      type: "WONDROUS_ITEM",
      rarity: "COMMON",
      isMagical: true,
      description: "A cheerful wand.",
      weight: 1,
      valueAmount: 20,
      valueCurrency: "gp",
    },
    cachedAt: new Date("2026-06-24T10:00:00.000Z"),
    expiresAt: null,
    createdAt: new Date("2026-06-24T10:00:00.000Z"),
    updatedAt: new Date("2026-06-24T10:00:00.000Z"),
  });
}

describe("Item catalog handlers", () => {
  it("imports Open5e magic item into campaign inventory snapshot", async () => {
    const repository: InventoryItemRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };
    const resolver: Open5eExternalReferenceResolver = {
      getById: vi.fn().mockResolvedValue(null),
      getOrRefresh: vi.fn().mockResolvedValue(createExternalReference()),
    } as unknown as Open5eExternalReferenceResolver;
    const handler = new ImportOpen5eItemToInventoryHandler(
      repository,
      createAccessService(),
      createOwnerService(),
      resolver,
    );

    const result = await handler.execute(
      new ImportOpen5eItemToInventoryCommand({
        campaignId: "campaign-1",
        actorUserId: "player-1",
        resourceType: "MAGIC_ITEM",
        resourceKey: "wand-of-smiles",
        ownerType: "CHARACTER",
        ownerId: "character-1",
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.source).toBe("OPEN5E");
    expect(result.type).toBe("WONDROUS_ITEM");
    expect(result.rarity).toBe("COMMON");
    expect(result.isMagical).toBe(true);
  });

  it("lists only items owned by the actor's characters", async () => {
    const characterReadRepository: CharacterReadRepository = {
      listCampaignCharacters: vi.fn().mockResolvedValue([
        { id: "character-1", ownerUserId: "player-1" },
        { id: "character-2", ownerUserId: "other-user" },
      ]),
      getCharacterDetails: vi.fn(),
    } as unknown as CharacterReadRepository;
    const inventoryReadRepository: InventoryItemReadRepository = {
      listCampaignInventory: vi.fn(),
      getInventoryItemDetails: vi.fn(),
      listOwnerInventory: vi.fn().mockImplementation((_campaignId, _ownerType, ownerId) =>
        Promise.resolve(
          ownerId === "character-1"
            ? [
                InventoryItem.create({
                  id: "item-1",
                  campaignId: "campaign-1",
                  itemTemplateId: null,
                  source: "CUSTOM",
                  externalReferenceId: null,
                  name: "Rope",
                  type: "GEAR",
                  rarity: null,
                  isMagical: false,
                  description: null,
                  weight: 10,
                  valueAmount: 1,
                  valueCurrency: "gp",
                  quantity: 1,
                  charges: null,
                  maxCharges: null,
                  isEquipped: false,
                  isAttuned: false,
                  isIdentified: true,
                  ownerType: InventoryOwnerType.create("CHARACTER"),
                  ownerId: "character-1",
                  visibility: ItemVisibility.public(),
                  customProperties: null,
                  createdAt: new Date("2026-06-24T10:00:00.000Z"),
                  updatedAt: new Date("2026-06-24T10:00:00.000Z"),
                  deletedAt: null,
                }),
              ]
            : [],
        ),
      ),
    };
    const handler = new ListMyInventoryItemsHandler(
      createAccessService(),
      characterReadRepository,
      inventoryReadRepository,
    );

    const result = await handler.execute(
      new ListMyInventoryItemsQuery({
        campaignId: "campaign-1",
        actorUserId: "player-1",
      }),
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.ownerId).toBe("character-1");
    expect(inventoryReadRepository.listOwnerInventory).toHaveBeenCalledWith(
      "campaign-1",
      InventoryOwnerType.create("CHARACTER"),
      "character-1",
    );
  });
});
