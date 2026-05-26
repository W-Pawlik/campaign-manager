import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class DeleteCampaignHandler implements CommandHandler<DeleteCampaignCommand, void> {
  public constructor(private readonly campaignRepository: CampaignRepository) {}

  public async execute(command: DeleteCampaignCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null) {
      throw new NotFoundError("Campaign not found");
    }

    const role = await this.campaignRepository.findUserRole(command.input.campaignId, command.input.actorUserId);

    if (role === null || !role.isOwner()) {
      throw new ForbiddenError("Only campaign owner can delete campaign");
    }

    await this.campaignRepository.save(campaign.softDelete(new Date()));
  }
}