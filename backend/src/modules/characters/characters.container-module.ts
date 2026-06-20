import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import { CreateCharacterHandler } from "@modules/characters/application/handlers/CreateCharacterHandler";
import { UpdateCharacterHandler } from "@modules/characters/application/handlers/UpdateCharacterHandler";
import { ArchiveCharacterHandler } from "@modules/characters/application/handlers/ArchiveCharacterHandler";
import { DeleteCharacterHandler } from "@modules/characters/application/handlers/DeleteCharacterHandler";
import { ListCampaignCharactersHandler } from "@modules/characters/application/handlers/ListCampaignCharactersHandler";
import { GetCharacterDetailsHandler } from "@modules/characters/application/handlers/GetCharacterDetailsHandler";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";
import { CharacterPermissionDomainService } from "@modules/characters/domain/services/CharacterPermissionDomainService";
import { CharacterMapper } from "@modules/characters/infrastructure/persistence/CharacterMapper";
import { PrismaCharacterReadRepository } from "@modules/characters/infrastructure/persistence/PrismaCharacterReadRepository";
import { PrismaCharacterRepository } from "@modules/characters/infrastructure/persistence/PrismaCharacterRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";

export function loadCharactersContainerModule(container: Container): void {
  container
    .bind<CharacterMapper>(CHARACTERS_TYPES.CharacterMapper)
    .toDynamicValue(() => new CharacterMapper())
    .inSingletonScope();

  container
    .bind<CharacterPermissionDomainService>(CHARACTERS_TYPES.CharacterPermissionDomainService)
    .toDynamicValue(() => new CharacterPermissionDomainService())
    .inSingletonScope();

  container
    .bind<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<CharacterMapper>(CHARACTERS_TYPES.CharacterMapper);

      return new PrismaCharacterRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<CharacterReadRepository>(CHARACTERS_TYPES.CharacterReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaCharacterReadRepository(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<CreateCharacterHandler>(CHARACTERS_TYPES.CreateCharacterHandler)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new CreateCharacterHandler(characterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<UpdateCharacterHandler>(CHARACTERS_TYPES.UpdateCharacterHandler)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<CharacterPermissionDomainService>(
        CHARACTERS_TYPES.CharacterPermissionDomainService,
      );

      return new UpdateCharacterHandler(characterRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<ArchiveCharacterHandler>(CHARACTERS_TYPES.ArchiveCharacterHandler)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<CharacterPermissionDomainService>(
        CHARACTERS_TYPES.CharacterPermissionDomainService,
      );

      return new ArchiveCharacterHandler(characterRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<DeleteCharacterHandler>(CHARACTERS_TYPES.DeleteCharacterHandler)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<CharacterPermissionDomainService>(
        CHARACTERS_TYPES.CharacterPermissionDomainService,
      );

      return new DeleteCharacterHandler(characterRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignCharactersHandler>(CHARACTERS_TYPES.ListCampaignCharactersHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const characterReadRepository = context.get<CharacterReadRepository>(
        CHARACTERS_TYPES.CharacterReadRepository,
      );

      return new ListCampaignCharactersHandler(accessService, characterReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetCharacterDetailsHandler>(CHARACTERS_TYPES.GetCharacterDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const characterReadRepository = context.get<CharacterReadRepository>(
        CHARACTERS_TYPES.CharacterReadRepository,
      );

      return new GetCharacterDetailsHandler(accessService, characterReadRepository);
    })
    .inTransientScope();
}
