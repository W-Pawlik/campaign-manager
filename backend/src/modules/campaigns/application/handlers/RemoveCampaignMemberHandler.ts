import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { RemoveCampaignMemberCommand } from "@modules/campaigns/application/commands/RemoveCampaignMemberCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { requireCampaignOwnerRole } from "@modules/campaigns/application/services/CampaignMembershipAccess";

export class RemoveCampaignMemberHandler
  implements CommandHandler<RemoveCampaignMemberCommand, void>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
  ) {}

  public async execute(command: RemoveCampaignMemberCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    await requireCampaignOwnerRole(
      this.membershipRepository,
      command.input.campaignId,
      command.input.actorUserId,
    );

    const member = await this.membershipRepository.findMemberById(
      command.input.campaignId,
      command.input.memberId,
    );

    if (member === null || member.status.value !== "ACTIVE") {
      throw new NotFoundError("Campaign member not found");
    }

    if (member.role.isOwner()) {
      throw new ForbiddenError("Owner cannot be removed without ownership transfer");
    }

    await this.membershipRepository.saveMember(member.markRemoved(new Date()));
  }
}
