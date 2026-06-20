import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateNoteCommand } from "@modules/notes/application/commands/CreateNoteCommand";
import { DeleteNoteCommand } from "@modules/notes/application/commands/DeleteNoteCommand";
import { PinNoteCommand } from "@modules/notes/application/commands/PinNoteCommand";
import { UnpinNoteCommand } from "@modules/notes/application/commands/UnpinNoteCommand";
import { UpdateNoteCommand } from "@modules/notes/application/commands/UpdateNoteCommand";
import { GetNoteDetailsQuery } from "@modules/notes/application/queries/GetNoteDetailsQuery";
import { ListCampaignNotesQuery } from "@modules/notes/application/queries/ListCampaignNotesQuery";
import { ListRelatedNotesQuery } from "@modules/notes/application/queries/ListRelatedNotesQuery";
import { NOTES_TYPES } from "@modules/notes/notes.types";

export function registerNotesHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateNoteCommand.name, NOTES_TYPES.CreateNoteHandler);
  commandBus.register(UpdateNoteCommand.name, NOTES_TYPES.UpdateNoteHandler);
  commandBus.register(DeleteNoteCommand.name, NOTES_TYPES.DeleteNoteHandler);
  commandBus.register(PinNoteCommand.name, NOTES_TYPES.PinNoteHandler);
  commandBus.register(UnpinNoteCommand.name, NOTES_TYPES.UnpinNoteHandler);

  queryBus.register(ListCampaignNotesQuery.name, NOTES_TYPES.ListCampaignNotesHandler);
  queryBus.register(GetNoteDetailsQuery.name, NOTES_TYPES.GetNoteDetailsHandler);
  queryBus.register(ListRelatedNotesQuery.name, NOTES_TYPES.ListRelatedNotesHandler);
}
