import type { Command } from "@core/application/cqrs/Command";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";

export interface CreateCampaignInput {
  ownerUserId: string;
  name: string;
  description?: string | null;
  gameSystemId?: string | null;
  visibility?: string;
  defaultLanguage?: string | null;
  currentDateInWorld?: string | null;
  worldName?: string | null;
  startingLevel?: number | null;
}

export class CreateCampaignCommand implements Command<CampaignDetailsDTO> {
  public constructor(public readonly input: CreateCampaignInput) {}
}
