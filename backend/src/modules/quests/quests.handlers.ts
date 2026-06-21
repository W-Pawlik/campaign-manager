import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { AddQuestObjectiveCommand } from "@modules/quests/application/commands/AddQuestObjectiveCommand";
import { ChangeQuestStatusCommand } from "@modules/quests/application/commands/ChangeQuestStatusCommand";
import { CreateQuestCommand } from "@modules/quests/application/commands/CreateQuestCommand";
import { DeleteQuestCommand } from "@modules/quests/application/commands/DeleteQuestCommand";
import { DeleteQuestObjectiveCommand } from "@modules/quests/application/commands/DeleteQuestObjectiveCommand";
import { LinkQuestEntityCommand } from "@modules/quests/application/commands/LinkQuestEntityCommand";
import { UnlinkQuestEntityCommand } from "@modules/quests/application/commands/UnlinkQuestEntityCommand";
import { UpdateQuestCommand } from "@modules/quests/application/commands/UpdateQuestCommand";
import { UpdateQuestObjectiveCommand } from "@modules/quests/application/commands/UpdateQuestObjectiveCommand";
import { GetQuestDetailsQuery } from "@modules/quests/application/queries/GetQuestDetailsQuery";
import { ListCampaignQuestsQuery } from "@modules/quests/application/queries/ListCampaignQuestsQuery";
import { ListQuestObjectivesQuery } from "@modules/quests/application/queries/ListQuestObjectivesQuery";
import { QUESTS_TYPES } from "@modules/quests/quests.types";

export function registerQuestsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateQuestCommand.name, QUESTS_TYPES.CreateQuestHandler);
  commandBus.register(UpdateQuestCommand.name, QUESTS_TYPES.UpdateQuestHandler);
  commandBus.register(DeleteQuestCommand.name, QUESTS_TYPES.DeleteQuestHandler);
  commandBus.register(ChangeQuestStatusCommand.name, QUESTS_TYPES.ChangeQuestStatusHandler);
  commandBus.register(AddQuestObjectiveCommand.name, QUESTS_TYPES.AddQuestObjectiveHandler);
  commandBus.register(UpdateQuestObjectiveCommand.name, QUESTS_TYPES.UpdateQuestObjectiveHandler);
  commandBus.register(DeleteQuestObjectiveCommand.name, QUESTS_TYPES.DeleteQuestObjectiveHandler);
  commandBus.register(LinkQuestEntityCommand.name, QUESTS_TYPES.LinkQuestEntityHandler);
  commandBus.register(UnlinkQuestEntityCommand.name, QUESTS_TYPES.UnlinkQuestEntityHandler);

  queryBus.register(ListCampaignQuestsQuery.name, QUESTS_TYPES.ListCampaignQuestsHandler);
  queryBus.register(GetQuestDetailsQuery.name, QUESTS_TYPES.GetQuestDetailsHandler);
  queryBus.register(ListQuestObjectivesQuery.name, QUESTS_TYPES.ListQuestObjectivesHandler);
}
