import type { Query } from "@core/application/cqrs/Query";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";

export interface ListCampaignInvitationsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignInvitationsQuery implements Query<CampaignInvitationDTO[]> {
  public constructor(public readonly input: ListCampaignInvitationsInput) {}
}
