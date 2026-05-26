import type { Query } from "@core/application/cqrs/Query";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";

export interface GetCampaignDetailsInput {
  campaignId: string;
  userId: string;
}

export class GetCampaignDetailsQuery implements Query<CampaignDetailsDTO> {
  public constructor(public readonly input: GetCampaignDetailsInput) {}
}