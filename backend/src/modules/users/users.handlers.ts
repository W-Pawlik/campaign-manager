import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { ChangeCurrentUserPasswordCommand } from "@modules/users/application/commands/ChangeCurrentUserPasswordCommand";
import { DeleteCurrentUserAccountCommand } from "@modules/users/application/commands/DeleteCurrentUserAccountCommand";
import { UpdateCurrentUserProfileCommand } from "@modules/users/application/commands/UpdateCurrentUserProfileCommand";
import { GetCurrentUserProfileQuery } from "@modules/users/application/queries/GetCurrentUserProfileQuery";
import { USERS_TYPES } from "@modules/users/users.types";

export function registerUsersHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(UpdateCurrentUserProfileCommand.name, USERS_TYPES.UpdateCurrentUserProfileHandler);
  commandBus.register(
    ChangeCurrentUserPasswordCommand.name,
    USERS_TYPES.ChangeCurrentUserPasswordHandler,
  );
  commandBus.register(DeleteCurrentUserAccountCommand.name, USERS_TYPES.DeleteCurrentUserAccountHandler);
  queryBus.register(GetCurrentUserProfileQuery.name, USERS_TYPES.GetCurrentUserProfileHandler);
}
