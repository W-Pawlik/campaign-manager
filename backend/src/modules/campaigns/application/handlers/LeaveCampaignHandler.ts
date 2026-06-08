import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { LeaveCampaignCommand } from "@modules/campaigns/application/commands/LeaveCampaignCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";

export class LeaveCampaignHandler implements CommandHandler<LeaveCampaignCommand, void> {
  public constructor(
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: LeaveCampaignCommand): Promise<void> {
    const { member } = await this.accessService.requireMembership(
      command.input.campaignId,
      command.input.actorUserId,
    );

    if (member.role.isOwner()) {
      throw new ForbiddenError("Owner cannot leave campaign without ownership transfer");
    }

    await this.membershipRepository.saveMember(member.markLeft(new Date()));
  }
}
