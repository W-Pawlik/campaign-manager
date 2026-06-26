import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import { AcceptCampaignInvitationCommand } from "@modules/campaigns/application/commands/AcceptCampaignInvitationCommand";
import { ChangeCampaignMemberRoleCommand } from "@modules/campaigns/application/commands/ChangeCampaignMemberRoleCommand";
import { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { DeclineCampaignInvitationCommand } from "@modules/campaigns/application/commands/DeclineCampaignInvitationCommand";
import { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import { InviteCampaignMemberCommand } from "@modules/campaigns/application/commands/InviteCampaignMemberCommand";
import { LeaveCampaignCommand } from "@modules/campaigns/application/commands/LeaveCampaignCommand";
import { RemoveCampaignMemberCommand } from "@modules/campaigns/application/commands/RemoveCampaignMemberCommand";
import { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import { TransferCampaignOwnershipCommand } from "@modules/campaigns/application/commands/TransferCampaignOwnershipCommand";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import { ListCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCampaignInvitationsQuery";
import { ListCurrentUserCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCurrentUserCampaignInvitationsQuery";
import { ListCampaignMembersQuery } from "@modules/campaigns/application/queries/ListCampaignMembersQuery";
import { ListUserCampaignsQuery } from "@modules/campaigns/application/queries/ListUserCampaignsQuery";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";

export function registerCampaignsHandlers(container: Container): void {
  const commandBus = container.get<CommandBus>(CORE_TYPES.CommandBus);
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  commandBus.register(CreateCampaignCommand.name, CAMPAIGNS_TYPES.CreateCampaignHandler);
  commandBus.register(UpdateCampaignCommand.name, CAMPAIGNS_TYPES.UpdateCampaignHandler);
  commandBus.register(
    CreateCampaignCoverImageUploadCommand.name,
    CAMPAIGNS_TYPES.CreateCampaignCoverImageUploadHandler,
  );
  commandBus.register(ArchiveCampaignCommand.name, CAMPAIGNS_TYPES.ArchiveCampaignHandler);
  commandBus.register(RestoreCampaignCommand.name, CAMPAIGNS_TYPES.RestoreCampaignHandler);
  commandBus.register(DeleteCampaignCommand.name, CAMPAIGNS_TYPES.DeleteCampaignHandler);
  commandBus.register(InviteCampaignMemberCommand.name, CAMPAIGNS_TYPES.InviteCampaignMemberHandler);
  commandBus.register(
    AcceptCampaignInvitationCommand.name,
    CAMPAIGNS_TYPES.AcceptCampaignInvitationHandler,
  );
  commandBus.register(
    DeclineCampaignInvitationCommand.name,
    CAMPAIGNS_TYPES.DeclineCampaignInvitationHandler,
  );
  commandBus.register(
    ChangeCampaignMemberRoleCommand.name,
    CAMPAIGNS_TYPES.ChangeCampaignMemberRoleHandler,
  );
  commandBus.register(RemoveCampaignMemberCommand.name, CAMPAIGNS_TYPES.RemoveCampaignMemberHandler);
  commandBus.register(LeaveCampaignCommand.name, CAMPAIGNS_TYPES.LeaveCampaignHandler);
  commandBus.register(
    TransferCampaignOwnershipCommand.name,
    CAMPAIGNS_TYPES.TransferCampaignOwnershipHandler,
  );

  queryBus.register(ListUserCampaignsQuery.name, CAMPAIGNS_TYPES.ListUserCampaignsHandler);
  queryBus.register(GetCampaignDetailsQuery.name, CAMPAIGNS_TYPES.GetCampaignDetailsHandler);
  queryBus.register(ListCampaignMembersQuery.name, CAMPAIGNS_TYPES.ListCampaignMembersHandler);
  queryBus.register(
    ListCampaignInvitationsQuery.name,
    CAMPAIGNS_TYPES.ListCampaignInvitationsHandler,
  );
  queryBus.register(
    ListCurrentUserCampaignInvitationsQuery.name,
    CAMPAIGNS_TYPES.ListCurrentUserCampaignInvitationsHandler,
  );
}
