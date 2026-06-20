import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateNpcCommand } from "@modules/npcs/application/commands/CreateNpcCommand";
import { DeleteNpcCommand } from "@modules/npcs/application/commands/DeleteNpcCommand";
import { UpdateNpcCommand } from "@modules/npcs/application/commands/UpdateNpcCommand";
import { GetNpcDetailsQuery } from "@modules/npcs/application/queries/GetNpcDetailsQuery";
import { ListCampaignNpcsQuery } from "@modules/npcs/application/queries/ListCampaignNpcsQuery";
import { NPCS_TYPES } from "@modules/npcs/npcs.types";

export function registerNpcsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateNpcCommand.name, NPCS_TYPES.CreateNpcHandler);
  commandBus.register(UpdateNpcCommand.name, NPCS_TYPES.UpdateNpcHandler);
  commandBus.register(DeleteNpcCommand.name, NPCS_TYPES.DeleteNpcHandler);

  queryBus.register(ListCampaignNpcsQuery.name, NPCS_TYPES.ListCampaignNpcsHandler);
  queryBus.register(GetNpcDetailsQuery.name, NPCS_TYPES.GetNpcDetailsHandler);
}
