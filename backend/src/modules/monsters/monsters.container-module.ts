import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { EXTERNAL_REFERENCES_TYPES } from "@modules/external-references/external-references.types";
import { ArchiveMonsterHandler } from "@modules/monsters/application/handlers/ArchiveMonsterHandler";
import { CopyMonsterToCampaignHandler } from "@modules/monsters/application/handlers/CopyMonsterToCampaignHandler";
import { CopyPublishedMonsterToCampaignHandler } from "@modules/monsters/application/handlers/CopyPublishedMonsterToCampaignHandler";
import { CreateCustomMonsterHandler } from "@modules/monsters/application/handlers/CreateCustomMonsterHandler";
import { CreatePublishedMonsterHandler } from "@modules/monsters/application/handlers/CreatePublishedMonsterHandler";
import { GetMonsterDetailsHandler } from "@modules/monsters/application/handlers/GetMonsterDetailsHandler";
import { GetPublishedMonsterDetailsHandler } from "@modules/monsters/application/handlers/GetPublishedMonsterDetailsHandler";
import { ImportOpen5eCreatureAsMonsterHandler } from "@modules/monsters/application/handlers/ImportOpen5eCreatureAsMonsterHandler";
import { ListCampaignMonstersHandler } from "@modules/monsters/application/handlers/ListCampaignMonstersHandler";
import { ListPublishedMonstersHandler } from "@modules/monsters/application/handlers/ListPublishedMonstersHandler";
import { UpdateMonsterHandler } from "@modules/monsters/application/handlers/UpdateMonsterHandler";
import type { MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { MonsterVisibilityApplicationService } from "@modules/monsters/application/services/MonsterVisibilityApplicationService";
import { MonsterMapper } from "@modules/monsters/infrastructure/persistence/MonsterMapper";
import { PrismaMonsterReadRepository } from "@modules/monsters/infrastructure/persistence/PrismaMonsterReadRepository";
import { PrismaMonsterRepository } from "@modules/monsters/infrastructure/persistence/PrismaMonsterRepository";
import { MONSTERS_TYPES } from "@modules/monsters/monsters.types";

export function loadMonstersContainerModule(container: Container): void {
  container.bind<MonsterMapper>(MONSTERS_TYPES.MonsterMapper).toDynamicValue(() => new MonsterMapper()).inSingletonScope();

  container
    .bind<MonsterRepository>(MONSTERS_TYPES.MonsterRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<MonsterMapper>(MONSTERS_TYPES.MonsterMapper);

      return new PrismaMonsterRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<MonsterReadRepository>(MONSTERS_TYPES.MonsterReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<MonsterMapper>(MONSTERS_TYPES.MonsterMapper);

      return new PrismaMonsterReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<MonsterVisibilityApplicationService>(MONSTERS_TYPES.MonsterVisibilityApplicationService)
    .toDynamicValue(() => new MonsterVisibilityApplicationService())
    .inTransientScope();

  container
    .bind<CreateCustomMonsterHandler>(MONSTERS_TYPES.CreateCustomMonsterHandler)
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(MONSTERS_TYPES.MonsterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);

      return new CreateCustomMonsterHandler(monsterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<CreatePublishedMonsterHandler>(MONSTERS_TYPES.CreatePublishedMonsterHandler)
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(
        MONSTERS_TYPES.MonsterRepository,
      );

      return new CreatePublishedMonsterHandler(monsterRepository);
    })
    .inTransientScope();

  container
    .bind<UpdateMonsterHandler>(MONSTERS_TYPES.UpdateMonsterHandler)
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(MONSTERS_TYPES.MonsterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);

      return new UpdateMonsterHandler(monsterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ArchiveMonsterHandler>(MONSTERS_TYPES.ArchiveMonsterHandler)
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(MONSTERS_TYPES.MonsterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);

      return new ArchiveMonsterHandler(monsterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<CopyMonsterToCampaignHandler>(MONSTERS_TYPES.CopyMonsterToCampaignHandler)
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(MONSTERS_TYPES.MonsterRepository);
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);

      return new CopyMonsterToCampaignHandler(monsterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<CopyPublishedMonsterToCampaignHandler>(
      MONSTERS_TYPES.CopyPublishedMonsterToCampaignHandler,
    )
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(
        MONSTERS_TYPES.MonsterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new CopyPublishedMonsterToCampaignHandler(
        monsterRepository,
        accessService,
      );
    })
    .inTransientScope();

  container
    .bind<ImportOpen5eCreatureAsMonsterHandler>(
      MONSTERS_TYPES.ImportOpen5eCreatureAsMonsterHandler,
    )
    .toDynamicValue((context) => {
      const monsterRepository = context.get<MonsterRepository>(
        MONSTERS_TYPES.MonsterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const resolver = context.get<Open5eExternalReferenceResolver>(
        EXTERNAL_REFERENCES_TYPES.Open5eExternalReferenceResolver,
      );

      return new ImportOpen5eCreatureAsMonsterHandler(
        monsterRepository,
        accessService,
        resolver,
      );
    })
    .inTransientScope();

  container
    .bind<ListCampaignMonstersHandler>(MONSTERS_TYPES.ListCampaignMonstersHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
      const monsterReadRepository = context.get<MonsterReadRepository>(MONSTERS_TYPES.MonsterReadRepository);
      const visibilityService = context.get<MonsterVisibilityApplicationService>(MONSTERS_TYPES.MonsterVisibilityApplicationService);

      return new ListCampaignMonstersHandler(accessService, monsterReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<ListPublishedMonstersHandler>(MONSTERS_TYPES.ListPublishedMonstersHandler)
    .toDynamicValue((context) => {
      const monsterReadRepository = context.get<MonsterReadRepository>(
        MONSTERS_TYPES.MonsterReadRepository,
      );

      return new ListPublishedMonstersHandler(monsterReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetMonsterDetailsHandler>(MONSTERS_TYPES.GetMonsterDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService);
      const monsterReadRepository = context.get<MonsterReadRepository>(MONSTERS_TYPES.MonsterReadRepository);
      const visibilityService = context.get<MonsterVisibilityApplicationService>(MONSTERS_TYPES.MonsterVisibilityApplicationService);

      return new GetMonsterDetailsHandler(accessService, monsterReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<GetPublishedMonsterDetailsHandler>(
      MONSTERS_TYPES.GetPublishedMonsterDetailsHandler,
    )
    .toDynamicValue((context) => {
      const monsterReadRepository = context.get<MonsterReadRepository>(
        MONSTERS_TYPES.MonsterReadRepository,
      );

      return new GetPublishedMonsterDetailsHandler(monsterReadRepository);
    })
    .inTransientScope();
}
