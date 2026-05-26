import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import { ArchiveCampaignHandler } from "@modules/campaigns/application/handlers/ArchiveCampaignHandler";
import { CreateCampaignHandler } from "@modules/campaigns/application/handlers/CreateCampaignHandler";
import { DeleteCampaignHandler } from "@modules/campaigns/application/handlers/DeleteCampaignHandler";
import { GetCampaignDetailsHandler } from "@modules/campaigns/application/handlers/GetCampaignDetailsHandler";
import { ListUserCampaignsHandler } from "@modules/campaigns/application/handlers/ListUserCampaignsHandler";
import { RestoreCampaignHandler } from "@modules/campaigns/application/handlers/RestoreCampaignHandler";
import { UpdateCampaignHandler } from "@modules/campaigns/application/handlers/UpdateCampaignHandler";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CampaignMapper } from "@modules/campaigns/infrastructure/persistence/CampaignMapper";
import { PrismaCampaignReadRepository } from "@modules/campaigns/infrastructure/persistence/PrismaCampaignReadRepository";
import { PrismaCampaignRepository } from "@modules/campaigns/infrastructure/persistence/PrismaCampaignRepository";

export function loadCampaignsContainerModule(container: Container): void {
  container
    .bind<CampaignMapper>(CAMPAIGNS_TYPES.CampaignMapper)
    .toDynamicValue(() => new CampaignMapper())
    .inSingletonScope();

  container
    .bind<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const campaignMapper = context.get<CampaignMapper>(CAMPAIGNS_TYPES.CampaignMapper);

      return new PrismaCampaignRepository(prismaClient, campaignMapper);
    })
    .inSingletonScope();

  container
    .bind<CampaignReadRepository>(CAMPAIGNS_TYPES.CampaignReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaCampaignReadRepository(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<CreateCampaignHandler>(CAMPAIGNS_TYPES.CreateCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);

      return new CreateCampaignHandler(campaignRepository);
    })
    .inTransientScope();

  container
    .bind<UpdateCampaignHandler>(CAMPAIGNS_TYPES.UpdateCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);

      return new UpdateCampaignHandler(campaignRepository);
    })
    .inTransientScope();

  container
    .bind<ArchiveCampaignHandler>(CAMPAIGNS_TYPES.ArchiveCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);

      return new ArchiveCampaignHandler(campaignRepository);
    })
    .inTransientScope();

  container
    .bind<RestoreCampaignHandler>(CAMPAIGNS_TYPES.RestoreCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);

      return new RestoreCampaignHandler(campaignRepository);
    })
    .inTransientScope();

  container
    .bind<DeleteCampaignHandler>(CAMPAIGNS_TYPES.DeleteCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);

      return new DeleteCampaignHandler(campaignRepository);
    })
    .inTransientScope();

  container
    .bind<ListUserCampaignsHandler>(CAMPAIGNS_TYPES.ListUserCampaignsHandler)
    .toDynamicValue((context) => {
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListUserCampaignsHandler(campaignReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetCampaignDetailsHandler>(CAMPAIGNS_TYPES.GetCampaignDetailsHandler)
    .toDynamicValue((context) => {
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new GetCampaignDetailsHandler(campaignReadRepository);
    })
    .inTransientScope();
}