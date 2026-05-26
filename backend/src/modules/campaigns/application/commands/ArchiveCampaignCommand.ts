import type { Command } from "@core/application/cqrs/Command";

export interface ArchiveCampaignInput {
  campaignId: string;
  actorUserId: string;
}

export class ArchiveCampaignCommand implements Command<void> {
  public constructor(public readonly input: ArchiveCampaignInput) {}
}