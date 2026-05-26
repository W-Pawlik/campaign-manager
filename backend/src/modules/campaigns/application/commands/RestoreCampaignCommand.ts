import type { Command } from "@core/application/cqrs/Command";

export interface RestoreCampaignInput {
  campaignId: string;
  actorUserId: string;
}

export class RestoreCampaignCommand implements Command<void> {
  public constructor(public readonly input: RestoreCampaignInput) {}
}