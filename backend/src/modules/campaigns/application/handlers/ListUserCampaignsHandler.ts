import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { ListUserCampaignsQuery } from "@modules/campaigns/application/queries/ListUserCampaignsQuery";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";

export class ListUserCampaignsHandler
  implements QueryHandler<ListUserCampaignsQuery, CampaignListItemDTO[]>
{
  public constructor(private readonly campaignReadRepository: CampaignReadRepository) {}

  public async execute(query: ListUserCampaignsQuery): Promise<CampaignListItemDTO[]> {
    return await this.campaignReadRepository.listForUser(query.input.userId);
  }
}