import type { Command } from "@core/application/cqrs/Command";

export interface LeaveCampaignInput {
  campaignId: string;
  actorUserId: string;
}

export class LeaveCampaignCommand implements Command<void> {
  public constructor(public readonly input: LeaveCampaignInput) {}
}
