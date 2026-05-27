import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { ListCampaignMembersQuery } from "@modules/campaigns/application/queries/ListCampaignMembersQuery";
import { requireCampaignManagerRole } from "@modules/campaigns/application/services/CampaignMembershipAccess";

export class ListCampaignMembersHandler
  implements QueryHandler<ListCampaignMembersQuery, CampaignMemberDTO[]>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly campaignReadRepository: CampaignReadRepository,
  ) {}

  public async execute(query: ListCampaignMembersQuery): Promise<CampaignMemberDTO[]> {
    const campaign = await this.campaignRepository.findById(query.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    await requireCampaignManagerRole(
      this.membershipRepository,
      query.input.campaignId,
      query.input.actorUserId,
    );

    return await this.campaignReadRepository.listMembers(query.input.campaignId);
  }
}
