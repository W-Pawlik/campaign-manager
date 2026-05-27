import type { Command } from "@core/application/cqrs/Command";

export interface DeclineCampaignInvitationInput {
  campaignId: string;
  invitationId: string;
  actorUserId: string;
}

export class DeclineCampaignInvitationCommand implements Command<void> {
  public constructor(public readonly input: DeclineCampaignInvitationInput) {}
}
