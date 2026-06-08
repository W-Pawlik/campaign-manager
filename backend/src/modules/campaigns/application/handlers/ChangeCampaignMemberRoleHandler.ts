import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { ChangeCampaignMemberRoleCommand } from "@modules/campaigns/application/commands/ChangeCampaignMemberRoleCommand";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CAMPAIGN_ROLE, CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export class ChangeCampaignMemberRoleHandler
  implements CommandHandler<ChangeCampaignMemberRoleCommand, void>
{
  public constructor(
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: ChangeCampaignMemberRoleCommand): Promise<void> {
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

    const role = CampaignRole.create(command.input.role);

    if (role.value === CAMPAIGN_ROLE.OWNER) {
      throw new ValidationError("Use ownership transfer to assign owner role");
    }

    if (member.role.isOwner()) {
      throw new ForbiddenError("Owner role cannot be changed without ownership transfer");
    }

    await this.membershipRepository.saveMember(member.withRole(role, new Date()));
  }
}
