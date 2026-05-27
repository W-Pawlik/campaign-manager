import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { LeaveCampaignCommand } from "@modules/campaigns/application/commands/LeaveCampaignCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class LeaveCampaignHandler implements CommandHandler<LeaveCampaignCommand, void> {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
  ) {}

  public async execute(command: LeaveCampaignCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const member = await this.membershipRepository.findActiveMemberByUserId(
      command.input.campaignId,
      command.input.actorUserId,
    );

    if (member === null) {
      throw new NotFoundError("Campaign member not found");
    }

    if (member.role.isOwner()) {
      throw new ForbiddenError("Owner cannot leave campaign without ownership transfer");
    }

    await this.membershipRepository.saveMember(member.markLeft(new Date()));
  }
}
