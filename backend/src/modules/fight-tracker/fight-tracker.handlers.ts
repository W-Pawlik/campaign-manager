import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateFightEncounterCommand } from "@modules/fight-tracker/application/commands/CreateFightEncounterCommand";
import { DeleteFightEncounterCommand } from "@modules/fight-tracker/application/commands/DeleteFightEncounterCommand";
import { FinishFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/FinishFightEncounterRunCommand";
import { StartFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/StartFightEncounterRunCommand";
import { UpdateFightEncounterCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterCommand";
import { UpdateFightEncounterRunStateCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterRunStateCommand";
import { GetFightEncounterDetailsQuery } from "@modules/fight-tracker/application/queries/GetFightEncounterDetailsQuery";
import { ListFightTrackerOverviewQuery } from "@modules/fight-tracker/application/queries/ListFightTrackerOverviewQuery";
import { FIGHT_TRACKER_TYPES } from "@modules/fight-tracker/fight-tracker.types";

export function registerFightTrackerHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateFightEncounterCommand.name, FIGHT_TRACKER_TYPES.CreateFightEncounterHandler);
  commandBus.register(UpdateFightEncounterCommand.name, FIGHT_TRACKER_TYPES.UpdateFightEncounterHandler);
  commandBus.register(DeleteFightEncounterCommand.name, FIGHT_TRACKER_TYPES.DeleteFightEncounterHandler);
  commandBus.register(
    StartFightEncounterRunCommand.name,
    FIGHT_TRACKER_TYPES.StartFightEncounterRunHandler,
  );
  commandBus.register(
    UpdateFightEncounterRunStateCommand.name,
    FIGHT_TRACKER_TYPES.UpdateFightEncounterRunStateHandler,
  );
  commandBus.register(
    FinishFightEncounterRunCommand.name,
    FIGHT_TRACKER_TYPES.FinishFightEncounterRunHandler,
  );

  queryBus.register(
    ListFightTrackerOverviewQuery.name,
    FIGHT_TRACKER_TYPES.ListFightTrackerOverviewHandler,
  );
  queryBus.register(
    GetFightEncounterDetailsQuery.name,
    FIGHT_TRACKER_TYPES.GetFightEncounterDetailsHandler,
  );
}
