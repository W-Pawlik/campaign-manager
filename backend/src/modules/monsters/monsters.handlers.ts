import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { ArchiveMonsterCommand } from "@modules/monsters/application/commands/ArchiveMonsterCommand";
import { CopyMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyMonsterToCampaignCommand";
import { CopyPublishedMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyPublishedMonsterToCampaignCommand";
import { CreateCustomMonsterCommand } from "@modules/monsters/application/commands/CreateCustomMonsterCommand";
import { CreatePublishedMonsterCommand } from "@modules/monsters/application/commands/CreatePublishedMonsterCommand";
import { ImportOpen5eCreatureAsMonsterCommand } from "@modules/monsters/application/commands/ImportOpen5eCreatureAsMonsterCommand";
import { UpdateMonsterCommand } from "@modules/monsters/application/commands/UpdateMonsterCommand";
import { GetPublishedMonsterDetailsQuery } from "@modules/monsters/application/queries/GetPublishedMonsterDetailsQuery";
import { GetMonsterDetailsQuery } from "@modules/monsters/application/queries/GetMonsterDetailsQuery";
import { ListPublishedMonstersQuery } from "@modules/monsters/application/queries/ListPublishedMonstersQuery";
import { ListCampaignMonstersQuery } from "@modules/monsters/application/queries/ListCampaignMonstersQuery";
import { MONSTERS_TYPES } from "@modules/monsters/monsters.types";

export function registerMonstersHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateCustomMonsterCommand.name, MONSTERS_TYPES.CreateCustomMonsterHandler);
  commandBus.register(CreatePublishedMonsterCommand.name, MONSTERS_TYPES.CreatePublishedMonsterHandler);
  commandBus.register(UpdateMonsterCommand.name, MONSTERS_TYPES.UpdateMonsterHandler);
  commandBus.register(ArchiveMonsterCommand.name, MONSTERS_TYPES.ArchiveMonsterHandler);
  commandBus.register(CopyMonsterToCampaignCommand.name, MONSTERS_TYPES.CopyMonsterToCampaignHandler);
  commandBus.register(
    CopyPublishedMonsterToCampaignCommand.name,
    MONSTERS_TYPES.CopyPublishedMonsterToCampaignHandler,
  );
  commandBus.register(
    ImportOpen5eCreatureAsMonsterCommand.name,
    MONSTERS_TYPES.ImportOpen5eCreatureAsMonsterHandler,
  );

  queryBus.register(ListCampaignMonstersQuery.name, MONSTERS_TYPES.ListCampaignMonstersHandler);
  queryBus.register(ListPublishedMonstersQuery.name, MONSTERS_TYPES.ListPublishedMonstersHandler);
  queryBus.register(GetMonsterDetailsQuery.name, MONSTERS_TYPES.GetMonsterDetailsHandler);
  queryBus.register(
    GetPublishedMonsterDetailsQuery.name,
    MONSTERS_TYPES.GetPublishedMonsterDetailsHandler,
  );
}
