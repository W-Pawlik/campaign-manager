import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { ListCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCampaignInvitationsQuery";
import { requireCampaignManagerRole } from "@modules/campaigns/application/services/CampaignMembershipAccess";

export class ListCampaignInvitationsHandler
  implements QueryHandler<ListCampaignInvitationsQuery, CampaignInvitationDTO[]>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly campaignReadRepository: CampaignReadRepository,
  ) {}

  public async execute(query: ListCampaignInvitationsQuery): Promise<CampaignInvitationDTO[]> {
    const campaign = await this.campaignRepository.findById(query.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    await requireCampaignManagerRole(
      this.membershipRepository,
      query.input.campaignId,
      query.input.actorUserId,
    );

    return await this.campaignReadRepository.listInvitations(query.input.campaignId);
  }
}
