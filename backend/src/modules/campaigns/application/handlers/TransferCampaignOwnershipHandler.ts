import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { TransferCampaignOwnershipCommand } from "@modules/campaigns/application/commands/TransferCampaignOwnershipCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class TransferCampaignOwnershipHandler
  implements CommandHandler<TransferCampaignOwnershipCommand, void>
{
  public constructor(
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: TransferCampaignOwnershipCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MEMBER_CHANGE_ROLE,
    );

    const member = await this.membershipRepository.findMemberById(
      command.input.campaignId,
      command.input.memberId,
    );

    if (member === null || member.status.value !== "ACTIVE") {
      throw new NotFoundError("Campaign member not found");
    }

    if (member.userId === command.input.actorUserId) {
      throw new ForbiddenError("Cannot transfer campaign ownership to current owner");
    }

    await this.membershipRepository.transferOwnership(
      command.input.campaignId,
      command.input.actorUserId,
      member,
    );
  }
}
