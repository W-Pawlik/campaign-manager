import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateLocationCommand } from "@modules/locations/application/commands/CreateLocationCommand";
import { DeleteLocationCommand } from "@modules/locations/application/commands/DeleteLocationCommand";
import { UpdateLocationCommand } from "@modules/locations/application/commands/UpdateLocationCommand";
import { GetLocationDetailsQuery } from "@modules/locations/application/queries/GetLocationDetailsQuery";
import { GetLocationTreeQuery } from "@modules/locations/application/queries/GetLocationTreeQuery";
import { ListCampaignLocationsQuery } from "@modules/locations/application/queries/ListCampaignLocationsQuery";
import { LOCATIONS_TYPES } from "@modules/locations/locations.types";

export function registerLocationsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateLocationCommand.name, LOCATIONS_TYPES.CreateLocationHandler);
  commandBus.register(UpdateLocationCommand.name, LOCATIONS_TYPES.UpdateLocationHandler);
  commandBus.register(DeleteLocationCommand.name, LOCATIONS_TYPES.DeleteLocationHandler);

  queryBus.register(
    ListCampaignLocationsQuery.name,
    LOCATIONS_TYPES.ListCampaignLocationsHandler,
  );
  queryBus.register(
    GetLocationDetailsQuery.name,
    LOCATIONS_TYPES.GetLocationDetailsHandler,
  );
  queryBus.register(GetLocationTreeQuery.name, LOCATIONS_TYPES.GetLocationTreeHandler);
}
