import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { AUTH_TYPES } from "@modules/auth/auth.types";
import { RegisterUserCommand } from "@modules/auth/application/commands/RegisterUserCommand";
import { LoginUserCommand } from "@modules/auth/application/commands/LoginUserCommand";
import { RefreshTokenCommand } from "@modules/auth/application/commands/RefreshTokenCommand";
import { LogoutCommand } from "@modules/auth/application/commands/LogoutCommand";
import { GetCurrentUserQuery } from "@modules/auth/application/queries/GetCurrentUserQuery";

export function registerAuthHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(RegisterUserCommand.name, AUTH_TYPES.RegisterUserHandler);
  commandBus.register(LoginUserCommand.name, AUTH_TYPES.LoginUserHandler);
  commandBus.register(RefreshTokenCommand.name, AUTH_TYPES.RefreshTokenHandler);
  commandBus.register(LogoutCommand.name, AUTH_TYPES.LogoutHandler);
  queryBus.register(GetCurrentUserQuery.name, AUTH_TYPES.GetCurrentUserHandler);
}
