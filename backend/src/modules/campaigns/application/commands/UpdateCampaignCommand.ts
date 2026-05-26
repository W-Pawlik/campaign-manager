import type { Command } from "@core/application/cqrs/Command";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";

export interface UpdateCampaignInput {
  campaignId: string;
  actorUserId: string;
  name?: string;
  visibility?: string;
}

export class UpdateCampaignCommand implements Command<CampaignDetailsDTO> {
  public constructor(public readonly input: UpdateCampaignInput) {}
}