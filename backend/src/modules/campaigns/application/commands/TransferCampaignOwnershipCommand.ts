import type { Command } from "@core/application/cqrs/Command";

export interface TransferCampaignOwnershipInput {
  campaignId: string;
  actorUserId: string;
  memberId: string;
}

export class TransferCampaignOwnershipCommand implements Command<void> {
  public constructor(public readonly input: TransferCampaignOwnershipInput) {}
}
