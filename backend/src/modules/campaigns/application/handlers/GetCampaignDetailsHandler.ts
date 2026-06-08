import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { mapCampaignDetailsFromDomain } from "@modules/campaigns/application/services/CampaignDtoMapper";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class GetCampaignDetailsHandler
  implements QueryHandler<GetCampaignDetailsQuery, CampaignDetailsDTO>
{
  public constructor(private readonly accessService: CampaignAccessApplicationService) {}

  public async execute(query: GetCampaignDetailsQuery): Promise<CampaignDetailsDTO> {
    const { campaign, role } = await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.userId,
      CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_READ,
    );

    return mapCampaignDetailsFromDomain(campaign, role);
  }
}
