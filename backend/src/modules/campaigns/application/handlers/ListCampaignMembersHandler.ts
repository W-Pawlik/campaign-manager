import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { ListCampaignMembersQuery } from "@modules/campaigns/application/queries/ListCampaignMembersQuery";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class ListCampaignMembersHandler
  implements QueryHandler<ListCampaignMembersQuery, CampaignMemberDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly campaignReadRepository: CampaignReadRepository,
  ) {}

  public async execute(query: ListCampaignMembersQuery): Promise<CampaignMemberDTO[]> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MEMBER_INVITE,
    );

    return await this.campaignReadRepository.listMembers(query.input.campaignId);
  }
}
