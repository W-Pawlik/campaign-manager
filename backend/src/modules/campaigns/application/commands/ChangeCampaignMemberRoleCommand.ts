import type { Command } from "@core/application/cqrs/Command";

export interface ChangeCampaignMemberRoleInput {
  campaignId: string;
  memberId: string;
  actorUserId: string;
  role: string;
}

export class ChangeCampaignMemberRoleCommand implements Command<void> {
  public constructor(public readonly input: ChangeCampaignMemberRoleInput) {}
}
