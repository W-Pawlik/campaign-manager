import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateChronicleEntryCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryCommand";
import { CreateChronicleEntryFromSessionCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryFromSessionCommand";
import { DeleteChronicleEntryCommand } from "@modules/chronicle/application/commands/DeleteChronicleEntryCommand";
import { PublishChronicleEntryCommand } from "@modules/chronicle/application/commands/PublishChronicleEntryCommand";
import { UpdateChronicleEntryCommand } from "@modules/chronicle/application/commands/UpdateChronicleEntryCommand";
import { GetChronicleEntryDetailsQuery } from "@modules/chronicle/application/queries/GetChronicleEntryDetailsQuery";
import { ListCampaignChronicleQuery } from "@modules/chronicle/application/queries/ListCampaignChronicleQuery";
import { CHRONICLE_TYPES } from "@modules/chronicle/chronicle.types";

export function registerChronicleHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateChronicleEntryCommand.name, CHRONICLE_TYPES.CreateChronicleEntryHandler);
  commandBus.register(UpdateChronicleEntryCommand.name, CHRONICLE_TYPES.UpdateChronicleEntryHandler);
  commandBus.register(DeleteChronicleEntryCommand.name, CHRONICLE_TYPES.DeleteChronicleEntryHandler);
  commandBus.register(PublishChronicleEntryCommand.name, CHRONICLE_TYPES.PublishChronicleEntryHandler);
  commandBus.register(
    CreateChronicleEntryFromSessionCommand.name,
    CHRONICLE_TYPES.CreateChronicleEntryFromSessionHandler,
  );

  queryBus.register(ListCampaignChronicleQuery.name, CHRONICLE_TYPES.ListCampaignChronicleHandler);
  queryBus.register(GetChronicleEntryDetailsQuery.name, CHRONICLE_TYPES.GetChronicleEntryDetailsHandler);
}
