import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import type { FileStorage } from "@core/application/storage/FileStorage";
import { CORE_TYPES } from "@core/di/core.types";
import { AcceptCampaignInvitationHandler } from "@modules/campaigns/application/handlers/AcceptCampaignInvitationHandler";
import { ArchiveCampaignHandler } from "@modules/campaigns/application/handlers/ArchiveCampaignHandler";
import { ChangeCampaignMemberRoleHandler } from "@modules/campaigns/application/handlers/ChangeCampaignMemberRoleHandler";
import { CreateCampaignCoverImageUploadHandler } from "@modules/campaigns/application/handlers/CreateCampaignCoverImageUploadHandler";
import { CreateCampaignHandler } from "@modules/campaigns/application/handlers/CreateCampaignHandler";
import { DeclineCampaignInvitationHandler } from "@modules/campaigns/application/handlers/DeclineCampaignInvitationHandler";
import { DeleteCampaignHandler } from "@modules/campaigns/application/handlers/DeleteCampaignHandler";
import { GetCampaignDetailsHandler } from "@modules/campaigns/application/handlers/GetCampaignDetailsHandler";
import { InviteCampaignMemberHandler } from "@modules/campaigns/application/handlers/InviteCampaignMemberHandler";
import { LeaveCampaignHandler } from "@modules/campaigns/application/handlers/LeaveCampaignHandler";
import { ListCampaignInvitationsHandler } from "@modules/campaigns/application/handlers/ListCampaignInvitationsHandler";
import { ListCampaignMembersHandler } from "@modules/campaigns/application/handlers/ListCampaignMembersHandler";
import { ListUserCampaignsHandler } from "@modules/campaigns/application/handlers/ListUserCampaignsHandler";
import { RemoveCampaignMemberHandler } from "@modules/campaigns/application/handlers/RemoveCampaignMemberHandler";
import { RestoreCampaignHandler } from "@modules/campaigns/application/handlers/RestoreCampaignHandler";
import { TransferCampaignOwnershipHandler } from "@modules/campaigns/application/handlers/TransferCampaignOwnershipHandler";
import { UpdateCampaignHandler } from "@modules/campaigns/application/handlers/UpdateCampaignHandler";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CampaignMapper } from "@modules/campaigns/infrastructure/persistence/CampaignMapper";
import { CampaignMembershipMapper } from "@modules/campaigns/infrastructure/persistence/CampaignMembershipMapper";
import { PrismaCampaignMembershipRepository } from "@modules/campaigns/infrastructure/persistence/PrismaCampaignMembershipRepository";
import { PrismaCampaignReadRepository } from "@modules/campaigns/infrastructure/persistence/PrismaCampaignReadRepository";
import { PrismaCampaignRepository } from "@modules/campaigns/infrastructure/persistence/PrismaCampaignRepository";

export function loadCampaignsContainerModule(container: Container): void {
  container
    .bind<CampaignMapper>(CAMPAIGNS_TYPES.CampaignMapper)
    .toDynamicValue(() => new CampaignMapper())
    .inSingletonScope();

  container
    .bind<CampaignMembershipMapper>(CAMPAIGNS_TYPES.CampaignMembershipMapper)
    .toDynamicValue(() => new CampaignMembershipMapper())
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
    .bind<CampaignMembershipRepository>(CAMPAIGNS_TYPES.CampaignMembershipRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<CampaignMembershipMapper>(
        CAMPAIGNS_TYPES.CampaignMembershipMapper,
      );

      return new PrismaCampaignMembershipRepository(prismaClient, mapper);
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
    .bind<CreateCampaignCoverImageUploadHandler>(
      CAMPAIGNS_TYPES.CreateCampaignCoverImageUploadHandler,
    )
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const fileStorage = context.get<FileStorage>(CORE_TYPES.FileStorage);

      return new CreateCampaignCoverImageUploadHandler(campaignRepository, fileStorage);
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
    .bind<InviteCampaignMemberHandler>(CAMPAIGNS_TYPES.InviteCampaignMemberHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new InviteCampaignMemberHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<AcceptCampaignInvitationHandler>(CAMPAIGNS_TYPES.AcceptCampaignInvitationHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new AcceptCampaignInvitationHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<DeclineCampaignInvitationHandler>(CAMPAIGNS_TYPES.DeclineCampaignInvitationHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new DeclineCampaignInvitationHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<ChangeCampaignMemberRoleHandler>(CAMPAIGNS_TYPES.ChangeCampaignMemberRoleHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new ChangeCampaignMemberRoleHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<RemoveCampaignMemberHandler>(CAMPAIGNS_TYPES.RemoveCampaignMemberHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new RemoveCampaignMemberHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<LeaveCampaignHandler>(CAMPAIGNS_TYPES.LeaveCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new LeaveCampaignHandler(campaignRepository, membershipRepository);
    })
    .inTransientScope();

  container
    .bind<TransferCampaignOwnershipHandler>(CAMPAIGNS_TYPES.TransferCampaignOwnershipHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );

      return new TransferCampaignOwnershipHandler(campaignRepository, membershipRepository);
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

  container
    .bind<ListCampaignMembersHandler>(CAMPAIGNS_TYPES.ListCampaignMembersHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListCampaignMembersHandler(
        campaignRepository,
        membershipRepository,
        campaignReadRepository,
      );
    })
    .inTransientScope();

  container
    .bind<ListCampaignInvitationsHandler>(CAMPAIGNS_TYPES.ListCampaignInvitationsHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListCampaignInvitationsHandler(
        campaignRepository,
        membershipRepository,
        campaignReadRepository,
      );
    })
    .inTransientScope();
}
