import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class RestoreCampaignHandler implements CommandHandler<RestoreCampaignCommand, void> {
  public constructor(private readonly campaignRepository: CampaignRepository) {}

  public async execute(command: RestoreCampaignCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null) {
      throw new NotFoundError("Campaign not found");
    }

    const role = await this.campaignRepository.findUserRole(command.input.campaignId, command.input.actorUserId);

    if (role === null || !role.isOwner()) {
      throw new ForbiddenError("Only campaign owner can restore campaign");
    }

    await this.campaignRepository.save(campaign.restore(new Date()));
  }
}