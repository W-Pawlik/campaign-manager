import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { ListCurrentUserCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCurrentUserCampaignInvitationsQuery";

export class ListCurrentUserCampaignInvitationsHandler
  implements QueryHandler<ListCurrentUserCampaignInvitationsQuery, CampaignInvitationDTO[]>
{
  public constructor(private readonly campaignReadRepository: CampaignReadRepository) {}

  public async execute(
    query: ListCurrentUserCampaignInvitationsQuery,
  ): Promise<CampaignInvitationDTO[]> {
    return await this.campaignReadRepository.listInvitationsForUser(query.input.userId);
  }
}
