import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class RestoreCampaignHandler implements CommandHandler<RestoreCampaignCommand, void> {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: RestoreCampaignCommand): Promise<void> {
    const { campaign } = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_ARCHIVE,
      { includeDeleted: true },
    );

    await this.campaignRepository.save(campaign.restore(new Date()));
  }
}
