import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class ArchiveCampaignHandler implements CommandHandler<ArchiveCampaignCommand, void> {
  public constructor(private readonly campaignRepository: CampaignRepository) {}

  public async execute(command: ArchiveCampaignCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const role = await this.campaignRepository.findUserRole(command.input.campaignId, command.input.actorUserId);

    if (role === null || !role.isOwner()) {
      throw new ForbiddenError("Only campaign owner can archive campaign");
    }

    await this.campaignRepository.save(campaign.archive(new Date()));
  }
}