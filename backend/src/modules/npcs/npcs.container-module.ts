import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CreateNpcHandler } from "@modules/npcs/application/handlers/CreateNpcHandler";
import { DeleteNpcHandler } from "@modules/npcs/application/handlers/DeleteNpcHandler";
import { GetNpcDetailsHandler } from "@modules/npcs/application/handlers/GetNpcDetailsHandler";
import { ListCampaignNpcsHandler } from "@modules/npcs/application/handlers/ListCampaignNpcsHandler";
import { UpdateNpcHandler } from "@modules/npcs/application/handlers/UpdateNpcHandler";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { PrismaNpcReadRepository } from "@modules/npcs/infrastructure/persistence/PrismaNpcReadRepository";
import { PrismaNpcRepository } from "@modules/npcs/infrastructure/persistence/PrismaNpcRepository";
import { NpcMapper } from "@modules/npcs/infrastructure/persistence/NpcMapper";
import { NPCS_TYPES } from "@modules/npcs/npcs.types";

export function loadNpcsContainerModule(container: Container): void {
  container
    .bind<NpcMapper>(NPCS_TYPES.NpcMapper)
    .toDynamicValue(() => new NpcMapper())
    .inSingletonScope();

  container
    .bind<NpcRepository>(NPCS_TYPES.NpcRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<NpcMapper>(NPCS_TYPES.NpcMapper);

      return new PrismaNpcRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<NpcReadRepository>(NPCS_TYPES.NpcReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<NpcMapper>(NPCS_TYPES.NpcMapper);

      return new PrismaNpcReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<CreateNpcHandler>(NPCS_TYPES.CreateNpcHandler)
    .toDynamicValue((context) => {
      const npcRepository = context.get<NpcRepository>(NPCS_TYPES.NpcRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new CreateNpcHandler(npcRepository, accessService, visibilityService);
    })
    .inTransientScope();

  container
    .bind<UpdateNpcHandler>(NPCS_TYPES.UpdateNpcHandler)
    .toDynamicValue((context) => {
      const npcRepository = context.get<NpcRepository>(NPCS_TYPES.NpcRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new UpdateNpcHandler(npcRepository, accessService, visibilityService);
    })
    .inTransientScope();

  container
    .bind<DeleteNpcHandler>(NPCS_TYPES.DeleteNpcHandler)
    .toDynamicValue((context) => {
      const npcRepository = context.get<NpcRepository>(NPCS_TYPES.NpcRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeleteNpcHandler(npcRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignNpcsHandler>(NPCS_TYPES.ListCampaignNpcsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const npcReadRepository = context.get<NpcReadRepository>(NPCS_TYPES.NpcReadRepository);

      return new ListCampaignNpcsHandler(accessService, visibilityService, npcReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetNpcDetailsHandler>(NPCS_TYPES.GetNpcDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const npcReadRepository = context.get<NpcReadRepository>(NPCS_TYPES.NpcReadRepository);

      return new GetNpcDetailsHandler(accessService, visibilityService, npcReadRepository);
    })
    .inTransientScope();
}
