import type { Command } from "@core/application/cqrs/Command";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";

export interface InviteCampaignMemberInput {
  campaignId: string;
  actorUserId: string;
  userId: string;
  role: string;
}

export class InviteCampaignMemberCommand implements Command<CampaignInvitationDTO> {
  public constructor(public readonly input: InviteCampaignMemberInput) {}
}
