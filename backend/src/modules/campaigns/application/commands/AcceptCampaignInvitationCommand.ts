import type { Command } from "@core/application/cqrs/Command";

export interface AcceptCampaignInvitationInput {
  campaignId: string;
  invitationId: string;
  actorUserId: string;
}

export class AcceptCampaignInvitationCommand implements Command<void> {
  public constructor(public readonly input: AcceptCampaignInvitationInput) {}
}
