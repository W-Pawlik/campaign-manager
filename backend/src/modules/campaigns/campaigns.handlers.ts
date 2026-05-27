import type { Container } from "inversify";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
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

  queryBus.register(ListUserCampaignsQuery.name, CAMPAIGNS_TYPES.ListUserCampaignsHandler);
  queryBus.register(GetCampaignDetailsQuery.name, CAMPAIGNS_TYPES.GetCampaignDetailsHandler);
}
