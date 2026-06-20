import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { ArchiveCharacterCommand } from "@modules/characters/application/commands/ArchiveCharacterCommand";
import { CreateCharacterCommand } from "@modules/characters/application/commands/CreateCharacterCommand";
import { DeleteCharacterCommand } from "@modules/characters/application/commands/DeleteCharacterCommand";
import { UpdateCharacterCommand } from "@modules/characters/application/commands/UpdateCharacterCommand";
import { GetCharacterDetailsQuery } from "@modules/characters/application/queries/GetCharacterDetailsQuery";
import { ListCampaignCharactersQuery } from "@modules/characters/application/queries/ListCampaignCharactersQuery";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";

export function registerCharactersHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateCharacterCommand.name, CHARACTERS_TYPES.CreateCharacterHandler);
  commandBus.register(UpdateCharacterCommand.name, CHARACTERS_TYPES.UpdateCharacterHandler);
  commandBus.register(ArchiveCharacterCommand.name, CHARACTERS_TYPES.ArchiveCharacterHandler);
  commandBus.register(DeleteCharacterCommand.name, CHARACTERS_TYPES.DeleteCharacterHandler);

  queryBus.register(
    ListCampaignCharactersQuery.name,
    CHARACTERS_TYPES.ListCampaignCharactersHandler,
  );
  queryBus.register(
    GetCharacterDetailsQuery.name,
    CHARACTERS_TYPES.GetCharacterDetailsHandler,
  );
}
