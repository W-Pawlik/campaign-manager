import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CancelSessionCommand } from "@modules/sessions/application/commands/CancelSessionCommand";
import { CompleteSessionCommand } from "@modules/sessions/application/commands/CompleteSessionCommand";
import { ConfirmSessionAttendanceCommand } from "@modules/sessions/application/commands/ConfirmSessionAttendanceCommand";
import { CreateSessionCommand } from "@modules/sessions/application/commands/CreateSessionCommand";
import { DeclineSessionAttendanceCommand } from "@modules/sessions/application/commands/DeclineSessionAttendanceCommand";
import { UpdateSessionCommand } from "@modules/sessions/application/commands/UpdateSessionCommand";
import { GetSessionDetailsQuery } from "@modules/sessions/application/queries/GetSessionDetailsQuery";
import { ListCampaignSessionsQuery } from "@modules/sessions/application/queries/ListCampaignSessionsQuery";
import { ListSessionParticipantsQuery } from "@modules/sessions/application/queries/ListSessionParticipantsQuery";
import { SESSIONS_TYPES } from "@modules/sessions/sessions.types";

export function registerSessionsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateSessionCommand.name, SESSIONS_TYPES.CreateSessionHandler);
  commandBus.register(UpdateSessionCommand.name, SESSIONS_TYPES.UpdateSessionHandler);
  commandBus.register(CancelSessionCommand.name, SESSIONS_TYPES.CancelSessionHandler);
  commandBus.register(ConfirmSessionAttendanceCommand.name, SESSIONS_TYPES.ConfirmSessionAttendanceHandler);
  commandBus.register(DeclineSessionAttendanceCommand.name, SESSIONS_TYPES.DeclineSessionAttendanceHandler);
  commandBus.register(CompleteSessionCommand.name, SESSIONS_TYPES.CompleteSessionHandler);

  queryBus.register(ListCampaignSessionsQuery.name, SESSIONS_TYPES.ListCampaignSessionsHandler);
  queryBus.register(GetSessionDetailsQuery.name, SESSIONS_TYPES.GetSessionDetailsHandler);
  queryBus.register(ListSessionParticipantsQuery.name, SESSIONS_TYPES.ListSessionParticipantsHandler);
}
