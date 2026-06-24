import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateInventoryItemCommand } from "@modules/items/application/commands/CreateInventoryItemCommand";
import { CreateItemTemplateCommand } from "@modules/items/application/commands/CreateItemTemplateCommand";
import { DeleteInventoryItemCommand } from "@modules/items/application/commands/DeleteInventoryItemCommand";
import { EquipInventoryItemCommand } from "@modules/items/application/commands/EquipInventoryItemCommand";
import { ImportOpen5eItemToInventoryCommand } from "@modules/items/application/commands/ImportOpen5eItemToInventoryCommand";
import { TransferInventoryItemCommand } from "@modules/items/application/commands/TransferInventoryItemCommand";
import { UnequipInventoryItemCommand } from "@modules/items/application/commands/UnequipInventoryItemCommand";
import { UpdateItemTemplateCommand } from "@modules/items/application/commands/UpdateItemTemplateCommand";
import { UpdateInventoryItemCommand } from "@modules/items/application/commands/UpdateInventoryItemCommand";
import { GetInventoryItemDetailsQuery } from "@modules/items/application/queries/GetInventoryItemDetailsQuery";
import { ListCampaignInventoryQuery } from "@modules/items/application/queries/ListCampaignInventoryQuery";
import { GetPublishedItemTemplateDetailsQuery } from "@modules/items/application/queries/GetPublishedItemTemplateDetailsQuery";
import { ListMyInventoryItemsQuery } from "@modules/items/application/queries/ListMyInventoryItemsQuery";
import { ListOwnerInventoryQuery } from "@modules/items/application/queries/ListOwnerInventoryQuery";
import { ListPublishedItemTemplatesQuery } from "@modules/items/application/queries/ListPublishedItemTemplatesQuery";
import { ITEMS_TYPES } from "@modules/items/items.types";

export function registerItemsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateItemTemplateCommand.name, ITEMS_TYPES.CreateItemTemplateHandler);
  commandBus.register(UpdateItemTemplateCommand.name, ITEMS_TYPES.UpdateItemTemplateHandler);
  commandBus.register(CreateInventoryItemCommand.name, ITEMS_TYPES.CreateInventoryItemHandler);
  commandBus.register(ImportOpen5eItemToInventoryCommand.name, ITEMS_TYPES.ImportOpen5eItemToInventoryHandler);
  commandBus.register(UpdateInventoryItemCommand.name, ITEMS_TYPES.UpdateInventoryItemHandler);
  commandBus.register(DeleteInventoryItemCommand.name, ITEMS_TYPES.DeleteInventoryItemHandler);
  commandBus.register(TransferInventoryItemCommand.name, ITEMS_TYPES.TransferInventoryItemHandler);
  commandBus.register(EquipInventoryItemCommand.name, ITEMS_TYPES.EquipInventoryItemHandler);
  commandBus.register(UnequipInventoryItemCommand.name, ITEMS_TYPES.UnequipInventoryItemHandler);

  queryBus.register(ListCampaignInventoryQuery.name, ITEMS_TYPES.ListCampaignInventoryHandler);
  queryBus.register(GetInventoryItemDetailsQuery.name, ITEMS_TYPES.GetInventoryItemDetailsHandler);
  queryBus.register(ListOwnerInventoryQuery.name, ITEMS_TYPES.ListOwnerInventoryHandler);
  queryBus.register(ListMyInventoryItemsQuery.name, ITEMS_TYPES.ListMyInventoryItemsHandler);
  queryBus.register(ListPublishedItemTemplatesQuery.name, ITEMS_TYPES.ListPublishedItemTemplatesHandler);
  queryBus.register(
    GetPublishedItemTemplateDetailsQuery.name,
    ITEMS_TYPES.GetPublishedItemTemplateDetailsHandler,
  );
}
