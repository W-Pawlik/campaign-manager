import type { Command } from "@core/application/cqrs/Command";
import type { CampaignCoverImageUploadDTO } from "@modules/campaigns/application/dto/CampaignCoverImageUploadDTO";

export interface CreateCampaignCoverImageUploadInput {
  campaignId: string;
  actorUserId: string;
  fileName: string;
  contentType: string;
}

export class CreateCampaignCoverImageUploadCommand
  implements Command<CampaignCoverImageUploadDTO>
{
  public constructor(public readonly input: CreateCampaignCoverImageUploadInput) {}
}
