import type { Command } from "@core/application/cqrs/Command";

export interface RemoveCampaignMemberInput {
  campaignId: string;
  memberId: string;
  actorUserId: string;
}

export class RemoveCampaignMemberCommand implements Command<void> {
  public constructor(public readonly input: RemoveCampaignMemberInput) {}
}
