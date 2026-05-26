import type { Command } from "@core/application/cqrs/Command";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";

export interface CreateCampaignInput {
  ownerUserId: string;
  name: string;
  visibility?: string;
}

export class CreateCampaignCommand implements Command<CampaignDetailsDTO> {
  public constructor(public readonly input: CreateCampaignInput) {}
}