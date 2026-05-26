import type { Command } from "@core/application/cqrs/Command";

export interface DeleteCampaignInput {
  campaignId: string;
  actorUserId: string;
}

export class DeleteCampaignCommand implements Command<void> {
  public constructor(public readonly input: DeleteCampaignInput) {}
}