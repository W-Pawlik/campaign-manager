import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@core/application/errors/AppError";
import type { InviteCampaignMemberCommand } from "@modules/campaigns/application/commands/InviteCampaignMemberCommand";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { requireCampaignManagerRole } from "@modules/campaigns/application/services/CampaignMembershipAccess";
import { mapCampaignInvitationDto } from "@modules/campaigns/application/services/CampaignMembershipDtoMapper";
import { CampaignInvitation } from "@modules/campaigns/domain/entities/CampaignInvitation";
import { CAMPAIGN_ROLE, CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

export class InviteCampaignMemberHandler
  implements CommandHandler<InviteCampaignMemberCommand, CampaignInvitationDTO>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
  ) {}

  public async execute(command: InviteCampaignMemberCommand): Promise<CampaignInvitationDTO> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const actorRole = await requireCampaignManagerRole(
      this.membershipRepository,
      command.input.campaignId,
      command.input.actorUserId,
    );

    const role = CampaignRole.create(command.input.role);

    if (role.value === CAMPAIGN_ROLE.OWNER) {
      throw new ValidationError("Use ownership transfer to assign owner role");
    }

    if (role.canSeeFullCampaign() && !actorRole.isOwner()) {
      throw new ForbiddenError("Only campaign owner can invite GM or CO_GM members");
    }

    const activeMember = await this.membershipRepository.findActiveMemberByUserId(
      command.input.campaignId,
      command.input.userId,
    );

    if (activeMember !== null) {
      throw new ConflictError("User is already an active campaign member");
    }

    const activeInvitation = await this.membershipRepository.findActiveInvitationByUserId(
      command.input.campaignId,
      command.input.userId,
    );

    if (activeInvitation !== null) {
      throw new ConflictError("User already has an active campaign invitation");
    }

    const createdAt = new Date();
    const invitation = CampaignInvitation.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      userId: command.input.userId,
      role,
      status: MemberStatus.create("INVITED"),
      invitedById: command.input.actorUserId,
      respondedAt: null,
      createdAt,
      updatedAt: createdAt,
    });

    await this.membershipRepository.createInvitation(invitation);

    return mapCampaignInvitationDto(invitation);
  }
}
