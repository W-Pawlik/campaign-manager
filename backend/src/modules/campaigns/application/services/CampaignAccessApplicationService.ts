import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import type { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import type {
  CampaignPermissionAction,
  CampaignPermissionDomainService,
} from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export interface CampaignAccess {
  campaign: Campaign;
  member: CampaignMember;
  role: CampaignRole;
}

export interface CampaignAccessOptions {
  includeDeleted?: boolean;
}

export class CampaignAccessApplicationService {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly permissionService: CampaignPermissionDomainService,
  ) {}

  public async requireMembership(
    campaignId: string,
    userId: string,
    options: CampaignAccessOptions = {},
  ): Promise<CampaignAccess> {
    const campaign = await this.campaignRepository.findById(campaignId);

    if (campaign === null || (campaign.deletedAt !== null && options.includeDeleted !== true)) {
      throw new NotFoundError("Campaign not found");
    }

    const member = await this.membershipRepository.findActiveMemberByUserId(campaignId, userId);

    if (member === null) {
      throw new ForbiddenError("Campaign membership required");
    }

    return {
      campaign,
      member,
      role: member.role,
    };
  }

  public async requirePermission(
    campaignId: string,
    userId: string,
    action: CampaignPermissionAction,
    options: CampaignAccessOptions = {},
  ): Promise<CampaignAccess> {
    const access = await this.requireMembership(campaignId, userId, options);

    if (!this.permissionService.can(access.role, action)) {
      throw new ForbiddenError("Insufficient campaign permissions");
    }

    return access;
  }
}
