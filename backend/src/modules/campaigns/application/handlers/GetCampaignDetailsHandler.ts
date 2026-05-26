import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";

export class GetCampaignDetailsHandler
  implements QueryHandler<GetCampaignDetailsQuery, CampaignDetailsDTO>
{
  public constructor(private readonly campaignReadRepository: CampaignReadRepository) {}

  public async execute(query: GetCampaignDetailsQuery): Promise<CampaignDetailsDTO> {
    const campaign = await this.campaignReadRepository.getDetailsForUser(
      query.input.campaignId,
      query.input.userId,
    );

    if (campaign === null) {
      throw new NotFoundError("Campaign not found");
    }

    return campaign;
  }
}