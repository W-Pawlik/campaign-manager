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
import { ListCurrentUserCampaignInvitationsHandler } from "@modules/campaigns/application/handlers/ListCurrentUserCampaignInvitationsHandler";
import { ListCampaignMembersHandler } from "@modules/campaigns/application/handlers/ListCampaignMembersHandler";
import { ListUserCampaignsHandler } from "@modules/campaigns/application/handlers/ListUserCampaignsHandler";
import { RemoveCampaignMemberHandler } from "@modules/campaigns/application/handlers/RemoveCampaignMemberHandler";
import { RestoreCampaignHandler } from "@modules/campaigns/application/handlers/RestoreCampaignHandler";
import { TransferCampaignOwnershipHandler } from "@modules/campaigns/application/handlers/TransferCampaignOwnershipHandler";
import { UpdateCampaignHandler } from "@modules/campaigns/application/handlers/UpdateCampaignHandler";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
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
    .bind<CampaignPermissionDomainService>(CAMPAIGNS_TYPES.CampaignPermissionDomainService)
    .toDynamicValue(() => new CampaignPermissionDomainService())
    .inSingletonScope();

  container
    .bind<CampaignAccessApplicationService>(CAMPAIGNS_TYPES.CampaignAccessApplicationService)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const permissionService = context.get<CampaignPermissionDomainService>(
        CAMPAIGNS_TYPES.CampaignPermissionDomainService,
      );

      return new CampaignAccessApplicationService(
        campaignRepository,
        membershipRepository,
        permissionService,
      );
    })
    .inTransientScope();

  container
    .bind<CampaignVisibilityApplicationService>(
      CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
    )
    .toDynamicValue((context) => {
      const permissionService = context.get<CampaignPermissionDomainService>(
        CAMPAIGNS_TYPES.CampaignPermissionDomainService,
      );

      return new CampaignVisibilityApplicationService(permissionService);
    })
    .inTransientScope();

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
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new UpdateCampaignHandler(campaignRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<CreateCampaignCoverImageUploadHandler>(
      CAMPAIGNS_TYPES.CreateCampaignCoverImageUploadHandler,
    )
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const fileStorage = context.get<FileStorage>(CORE_TYPES.FileStorage);

      return new CreateCampaignCoverImageUploadHandler(
        campaignRepository,
        accessService,
        fileStorage,
      );
    })
    .inTransientScope();

  container
    .bind<ArchiveCampaignHandler>(CAMPAIGNS_TYPES.ArchiveCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new ArchiveCampaignHandler(campaignRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<InviteCampaignMemberHandler>(CAMPAIGNS_TYPES.InviteCampaignMemberHandler)
    .toDynamicValue((context) => {
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<CampaignPermissionDomainService>(
        CAMPAIGNS_TYPES.CampaignPermissionDomainService,
      );

      return new InviteCampaignMemberHandler(
        membershipRepository,
        accessService,
        permissionService,
      );
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
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new ChangeCampaignMemberRoleHandler(membershipRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<RemoveCampaignMemberHandler>(CAMPAIGNS_TYPES.RemoveCampaignMemberHandler)
    .toDynamicValue((context) => {
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new RemoveCampaignMemberHandler(membershipRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<LeaveCampaignHandler>(CAMPAIGNS_TYPES.LeaveCampaignHandler)
    .toDynamicValue((context) => {
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new LeaveCampaignHandler(membershipRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<TransferCampaignOwnershipHandler>(CAMPAIGNS_TYPES.TransferCampaignOwnershipHandler)
    .toDynamicValue((context) => {
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new TransferCampaignOwnershipHandler(membershipRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<RestoreCampaignHandler>(CAMPAIGNS_TYPES.RestoreCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new RestoreCampaignHandler(campaignRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<DeleteCampaignHandler>(CAMPAIGNS_TYPES.DeleteCampaignHandler)
    .toDynamicValue((context) => {
      const campaignRepository = context.get<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeleteCampaignHandler(campaignRepository, accessService);
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
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new GetCampaignDetailsHandler(accessService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignMembersHandler>(CAMPAIGNS_TYPES.ListCampaignMembersHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListCampaignMembersHandler(
        accessService,
        campaignReadRepository,
      );
    })
    .inTransientScope();

  container
    .bind<ListCampaignInvitationsHandler>(CAMPAIGNS_TYPES.ListCampaignInvitationsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListCampaignInvitationsHandler(
        accessService,
        campaignReadRepository,
      );
    })
    .inTransientScope();

  container
    .bind<ListCurrentUserCampaignInvitationsHandler>(
      CAMPAIGNS_TYPES.ListCurrentUserCampaignInvitationsHandler,
    )
    .toDynamicValue((context) => {
      const campaignReadRepository = context.get<CampaignReadRepository>(
        CAMPAIGNS_TYPES.CampaignReadRepository,
      );

      return new ListCurrentUserCampaignInvitationsHandler(campaignReadRepository);
    })
    .inTransientScope();
}
