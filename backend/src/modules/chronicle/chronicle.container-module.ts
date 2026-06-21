import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CHRONICLE_TYPES } from "@modules/chronicle/chronicle.types";
import { CreateChronicleEntryHandler } from "@modules/chronicle/application/handlers/CreateChronicleEntryHandler";
import { CreateChronicleEntryFromSessionHandler } from "@modules/chronicle/application/handlers/CreateChronicleEntryFromSessionHandler";
import { DeleteChronicleEntryHandler } from "@modules/chronicle/application/handlers/DeleteChronicleEntryHandler";
import { GetChronicleEntryDetailsHandler } from "@modules/chronicle/application/handlers/GetChronicleEntryDetailsHandler";
import { ListCampaignChronicleHandler } from "@modules/chronicle/application/handlers/ListCampaignChronicleHandler";
import { PublishChronicleEntryHandler } from "@modules/chronicle/application/handlers/PublishChronicleEntryHandler";
import { UpdateChronicleEntryHandler } from "@modules/chronicle/application/handlers/UpdateChronicleEntryHandler";
import type { ChronicleEntryReadRepository } from "@modules/chronicle/application/ports/ChronicleEntryReadRepository";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { ChronicleVisibilityApplicationService } from "@modules/chronicle/application/services/ChronicleVisibilityApplicationService";
import { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";
import { ChronicleEntryMapper } from "@modules/chronicle/infrastructure/persistence/ChronicleEntryMapper";
import { PrismaChronicleEntryReadRepository } from "@modules/chronicle/infrastructure/persistence/PrismaChronicleEntryReadRepository";
import { PrismaChronicleEntryRepository } from "@modules/chronicle/infrastructure/persistence/PrismaChronicleEntryRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import { SESSIONS_TYPES } from "@modules/sessions/sessions.types";

export function loadChronicleContainerModule(container: Container): void {
  container
    .bind<ChronicleEntryMapper>(CHRONICLE_TYPES.ChronicleEntryMapper)
    .toDynamicValue(() => new ChronicleEntryMapper())
    .inSingletonScope();

  container
    .bind<ChroniclePermissionDomainService>(CHRONICLE_TYPES.ChroniclePermissionDomainService)
    .toDynamicValue(() => new ChroniclePermissionDomainService())
    .inSingletonScope();

  container
    .bind<ChronicleVisibilityApplicationService>(CHRONICLE_TYPES.ChronicleVisibilityApplicationService)
    .toDynamicValue((context) => {
      const campaignVisibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new ChronicleVisibilityApplicationService(campaignVisibilityService);
    })
    .inTransientScope();

  container
    .bind<ChronicleEntryRepository>(CHRONICLE_TYPES.ChronicleEntryRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ChronicleEntryMapper>(CHRONICLE_TYPES.ChronicleEntryMapper);

      return new PrismaChronicleEntryRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<ChronicleEntryReadRepository>(CHRONICLE_TYPES.ChronicleEntryReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ChronicleEntryMapper>(CHRONICLE_TYPES.ChronicleEntryMapper);

      return new PrismaChronicleEntryReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<CreateChronicleEntryHandler>(CHRONICLE_TYPES.CreateChronicleEntryHandler)
    .toDynamicValue((context) => {
      const chronicleRepository = context.get<ChronicleEntryRepository>(
        CHRONICLE_TYPES.ChronicleEntryRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<ChroniclePermissionDomainService>(
        CHRONICLE_TYPES.ChroniclePermissionDomainService,
      );

      return new CreateChronicleEntryHandler(chronicleRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<UpdateChronicleEntryHandler>(CHRONICLE_TYPES.UpdateChronicleEntryHandler)
    .toDynamicValue((context) => {
      const chronicleRepository = context.get<ChronicleEntryRepository>(
        CHRONICLE_TYPES.ChronicleEntryRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<ChroniclePermissionDomainService>(
        CHRONICLE_TYPES.ChroniclePermissionDomainService,
      );

      return new UpdateChronicleEntryHandler(chronicleRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<DeleteChronicleEntryHandler>(CHRONICLE_TYPES.DeleteChronicleEntryHandler)
    .toDynamicValue((context) => {
      const chronicleRepository = context.get<ChronicleEntryRepository>(
        CHRONICLE_TYPES.ChronicleEntryRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<ChroniclePermissionDomainService>(
        CHRONICLE_TYPES.ChroniclePermissionDomainService,
      );

      return new DeleteChronicleEntryHandler(chronicleRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<PublishChronicleEntryHandler>(CHRONICLE_TYPES.PublishChronicleEntryHandler)
    .toDynamicValue((context) => {
      const chronicleRepository = context.get<ChronicleEntryRepository>(
        CHRONICLE_TYPES.ChronicleEntryRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<ChroniclePermissionDomainService>(
        CHRONICLE_TYPES.ChroniclePermissionDomainService,
      );

      return new PublishChronicleEntryHandler(chronicleRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<CreateChronicleEntryFromSessionHandler>(CHRONICLE_TYPES.CreateChronicleEntryFromSessionHandler)
    .toDynamicValue((context) => {
      const chronicleRepository = context.get<ChronicleEntryRepository>(
        CHRONICLE_TYPES.ChronicleEntryRepository,
      );
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<ChroniclePermissionDomainService>(
        CHRONICLE_TYPES.ChroniclePermissionDomainService,
      );

      return new CreateChronicleEntryFromSessionHandler(
        chronicleRepository,
        sessionRepository,
        accessService,
        permissionService,
      );
    })
    .inTransientScope();

  container
    .bind<ListCampaignChronicleHandler>(CHRONICLE_TYPES.ListCampaignChronicleHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const chronicleReadRepository = context.get<ChronicleEntryReadRepository>(
        CHRONICLE_TYPES.ChronicleEntryReadRepository,
      );
      const visibilityService = context.get<ChronicleVisibilityApplicationService>(
        CHRONICLE_TYPES.ChronicleVisibilityApplicationService,
      );

      return new ListCampaignChronicleHandler(accessService, chronicleReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<GetChronicleEntryDetailsHandler>(CHRONICLE_TYPES.GetChronicleEntryDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const chronicleReadRepository = context.get<ChronicleEntryReadRepository>(
        CHRONICLE_TYPES.ChronicleEntryReadRepository,
      );
      const visibilityService = context.get<ChronicleVisibilityApplicationService>(
        CHRONICLE_TYPES.ChronicleVisibilityApplicationService,
      );

      return new GetChronicleEntryDetailsHandler(accessService, chronicleReadRepository, visibilityService);
    })
    .inTransientScope();
}
