import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import { LOCATIONS_TYPES } from "@modules/locations/locations.types";
import { CreateInventoryItemHandler } from "@modules/items/application/handlers/CreateInventoryItemHandler";
import { CreateItemTemplateHandler } from "@modules/items/application/handlers/CreateItemTemplateHandler";
import { DeleteInventoryItemHandler } from "@modules/items/application/handlers/DeleteInventoryItemHandler";
import { EquipInventoryItemHandler } from "@modules/items/application/handlers/EquipInventoryItemHandler";
import { GetInventoryItemDetailsHandler } from "@modules/items/application/handlers/GetInventoryItemDetailsHandler";
import { GetPublishedItemTemplateDetailsHandler } from "@modules/items/application/handlers/GetPublishedItemTemplateDetailsHandler";
import { ImportOpen5eItemToInventoryHandler } from "@modules/items/application/handlers/ImportOpen5eItemToInventoryHandler";
import { ListCampaignInventoryHandler } from "@modules/items/application/handlers/ListCampaignInventoryHandler";
import { ListMyInventoryItemsHandler } from "@modules/items/application/handlers/ListMyInventoryItemsHandler";
import { ListOwnerInventoryHandler } from "@modules/items/application/handlers/ListOwnerInventoryHandler";
import { ListPublishedItemTemplatesHandler } from "@modules/items/application/handlers/ListPublishedItemTemplatesHandler";
import { TransferInventoryItemHandler } from "@modules/items/application/handlers/TransferInventoryItemHandler";
import { UnequipInventoryItemHandler } from "@modules/items/application/handlers/UnequipInventoryItemHandler";
import { UpdateItemTemplateHandler } from "@modules/items/application/handlers/UpdateItemTemplateHandler";
import { UpdateInventoryItemHandler } from "@modules/items/application/handlers/UpdateInventoryItemHandler";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryVisibilityApplicationService } from "@modules/items/application/services/InventoryVisibilityApplicationService";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { EXTERNAL_REFERENCES_TYPES } from "@modules/external-references/external-references.types";
import { ItemMapper } from "@modules/items/infrastructure/persistence/ItemMapper";
import { PrismaInventoryItemReadRepository } from "@modules/items/infrastructure/persistence/PrismaInventoryItemReadRepository";
import { PrismaInventoryItemRepository } from "@modules/items/infrastructure/persistence/PrismaInventoryItemRepository";
import { PrismaItemTemplateRepository } from "@modules/items/infrastructure/persistence/PrismaItemTemplateRepository";
import { ITEMS_TYPES } from "@modules/items/items.types";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { NPCS_TYPES } from "@modules/npcs/npcs.types";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { QUESTS_TYPES } from "@modules/quests/quests.types";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import { SESSIONS_TYPES } from "@modules/sessions/sessions.types";

export function loadItemsContainerModule(container: Container): void {
  container.bind<ItemMapper>(ITEMS_TYPES.ItemMapper).toDynamicValue(() => new ItemMapper()).inSingletonScope();

  container
    .bind<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ItemMapper>(ITEMS_TYPES.ItemMapper);

      return new PrismaItemTemplateRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ItemMapper>(ITEMS_TYPES.ItemMapper);

      return new PrismaInventoryItemRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<InventoryItemReadRepository>(ITEMS_TYPES.InventoryItemReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ItemMapper>(ITEMS_TYPES.ItemMapper);

      return new PrismaInventoryItemReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const npcRepository = context.get<NpcRepository>(NPCS_TYPES.NpcRepository);
      const locationRepository = context.get<LocationRepository>(LOCATIONS_TYPES.LocationRepository);
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);

      return new InventoryOwnerApplicationService(
        characterRepository,
        npcRepository,
        locationRepository,
        questRepository,
        sessionRepository,
      );
    })
    .inTransientScope();

  container
    .bind<InventoryVisibilityApplicationService>(ITEMS_TYPES.InventoryVisibilityApplicationService)
    .toDynamicValue((context) => {
      const campaignVisibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

      return new InventoryVisibilityApplicationService(campaignVisibilityService, ownerService);
    })
    .inTransientScope();

  container.bind<CreateItemTemplateHandler>(ITEMS_TYPES.CreateItemTemplateHandler).toDynamicValue((context) => {
    const itemTemplateRepository = context.get<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository);

    return new CreateItemTemplateHandler(itemTemplateRepository);
  }).inTransientScope();

  container.bind<UpdateItemTemplateHandler>(ITEMS_TYPES.UpdateItemTemplateHandler).toDynamicValue((context) => {
    const itemTemplateRepository = context.get<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository);

    return new UpdateItemTemplateHandler(itemTemplateRepository);
  }).inTransientScope();

  container.bind<CreateInventoryItemHandler>(ITEMS_TYPES.CreateInventoryItemHandler).toDynamicValue((context) => {
    const itemTemplateRepository = context.get<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository);
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new CreateInventoryItemHandler(itemTemplateRepository, inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<UpdateInventoryItemHandler>(ITEMS_TYPES.UpdateInventoryItemHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new UpdateInventoryItemHandler(inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<ImportOpen5eItemToInventoryHandler>(ITEMS_TYPES.ImportOpen5eItemToInventoryHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);
    const resolver = context.get<Open5eExternalReferenceResolver>(
      EXTERNAL_REFERENCES_TYPES.Open5eExternalReferenceResolver,
    );

    return new ImportOpen5eItemToInventoryHandler(
      inventoryItemRepository,
      accessService,
      ownerService,
      resolver,
    );
  }).inTransientScope();

  container.bind<DeleteInventoryItemHandler>(ITEMS_TYPES.DeleteInventoryItemHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new DeleteInventoryItemHandler(inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<TransferInventoryItemHandler>(ITEMS_TYPES.TransferInventoryItemHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new TransferInventoryItemHandler(inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<EquipInventoryItemHandler>(ITEMS_TYPES.EquipInventoryItemHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new EquipInventoryItemHandler(inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<UnequipInventoryItemHandler>(ITEMS_TYPES.UnequipInventoryItemHandler).toDynamicValue((context) => {
    const inventoryItemRepository = context.get<InventoryItemRepository>(ITEMS_TYPES.InventoryItemRepository);
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);

    return new UnequipInventoryItemHandler(inventoryItemRepository, accessService, ownerService);
  }).inTransientScope();

  container.bind<ListCampaignInventoryHandler>(ITEMS_TYPES.ListCampaignInventoryHandler).toDynamicValue((context) => {
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const inventoryItemReadRepository = context.get<InventoryItemReadRepository>(ITEMS_TYPES.InventoryItemReadRepository);
    const visibilityService = context.get<InventoryVisibilityApplicationService>(ITEMS_TYPES.InventoryVisibilityApplicationService);

    return new ListCampaignInventoryHandler(accessService, inventoryItemReadRepository, visibilityService);
  }).inTransientScope();

  container.bind<GetInventoryItemDetailsHandler>(ITEMS_TYPES.GetInventoryItemDetailsHandler).toDynamicValue((context) => {
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const inventoryItemReadRepository = context.get<InventoryItemReadRepository>(ITEMS_TYPES.InventoryItemReadRepository);
    const visibilityService = context.get<InventoryVisibilityApplicationService>(ITEMS_TYPES.InventoryVisibilityApplicationService);

    return new GetInventoryItemDetailsHandler(accessService, inventoryItemReadRepository, visibilityService);
  }).inTransientScope();

  container.bind<ListOwnerInventoryHandler>(ITEMS_TYPES.ListOwnerInventoryHandler).toDynamicValue((context) => {
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const inventoryItemReadRepository = context.get<InventoryItemReadRepository>(ITEMS_TYPES.InventoryItemReadRepository);
    const ownerService = context.get<InventoryOwnerApplicationService>(ITEMS_TYPES.InventoryOwnerApplicationService);
    const visibilityService = context.get<InventoryVisibilityApplicationService>(ITEMS_TYPES.InventoryVisibilityApplicationService);

    return new ListOwnerInventoryHandler(accessService, inventoryItemReadRepository, ownerService, visibilityService);
  }).inTransientScope();

  container.bind<ListMyInventoryItemsHandler>(ITEMS_TYPES.ListMyInventoryItemsHandler).toDynamicValue((context) => {
    const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
    const characterReadRepository = context.get<CharacterReadRepository>(CHARACTERS_TYPES.CharacterReadRepository);
    const inventoryItemReadRepository = context.get<InventoryItemReadRepository>(ITEMS_TYPES.InventoryItemReadRepository);

    return new ListMyInventoryItemsHandler(
      accessService,
      characterReadRepository,
      inventoryItemReadRepository,
    );
  }).inTransientScope();

  container.bind<ListPublishedItemTemplatesHandler>(ITEMS_TYPES.ListPublishedItemTemplatesHandler).toDynamicValue((context) => {
    const itemTemplateRepository = context.get<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository);

    return new ListPublishedItemTemplatesHandler(itemTemplateRepository);
  }).inTransientScope();

  container.bind<GetPublishedItemTemplateDetailsHandler>(ITEMS_TYPES.GetPublishedItemTemplateDetailsHandler).toDynamicValue((context) => {
    const itemTemplateRepository = context.get<ItemTemplateRepository>(ITEMS_TYPES.ItemTemplateRepository);

    return new GetPublishedItemTemplateDetailsHandler(itemTemplateRepository);
  }).inTransientScope();
}
