import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { DeclineCampaignInvitationCommand } from "@modules/campaigns/application/commands/DeclineCampaignInvitationCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class DeclineCampaignInvitationHandler
  implements CommandHandler<DeclineCampaignInvitationCommand, void>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
  ) {}

  public async execute(command: DeclineCampaignInvitationCommand): Promise<void> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const invitation = await this.membershipRepository.findInvitationById(
      command.input.campaignId,
      command.input.invitationId,
    );

    if (invitation === null || invitation.status.value !== "INVITED") {
      throw new NotFoundError("Campaign invitation not found");
    }

    if (invitation.userId !== command.input.actorUserId) {
      throw new ForbiddenError("Only invited user can decline campaign invitation");
    }

    await this.membershipRepository.saveInvitation(invitation.decline(new Date()));
  }
}
