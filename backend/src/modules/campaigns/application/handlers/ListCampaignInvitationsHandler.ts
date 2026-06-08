import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { ListCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCampaignInvitationsQuery";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class ListCampaignInvitationsHandler
  implements QueryHandler<ListCampaignInvitationsQuery, CampaignInvitationDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly campaignReadRepository: CampaignReadRepository,
  ) {}

  public async execute(query: ListCampaignInvitationsQuery): Promise<CampaignInvitationDTO[]> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MEMBER_INVITE,
    );

    return await this.campaignReadRepository.listInvitations(query.input.campaignId);
  }
}
