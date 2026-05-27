import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { AcceptCampaignInvitationCommand } from "@modules/campaigns/application/commands/AcceptCampaignInvitationCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export class AcceptCampaignInvitationHandler
  implements CommandHandler<AcceptCampaignInvitationCommand, void>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
  ) {}

  public async execute(command: AcceptCampaignInvitationCommand): Promise<void> {
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
      throw new ForbiddenError("Only invited user can accept campaign invitation");
    }

    const activeMember = await this.membershipRepository.findActiveMemberByUserId(
      command.input.campaignId,
      command.input.actorUserId,
    );

    if (activeMember !== null) {
      await this.membershipRepository.saveInvitation(invitation.accept(new Date()));
      return;
    }

    const acceptedInvitation = invitation.accept(new Date());
    await this.membershipRepository.saveInvitation(acceptedInvitation);
    await this.membershipRepository.upsertActiveMemberFromInvitation(acceptedInvitation);
  }
}
