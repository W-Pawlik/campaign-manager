import type { Query } from "@core/application/cqrs/Query";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";

export interface ListCurrentUserCampaignInvitationsInput {
  userId: string;
}

export class ListCurrentUserCampaignInvitationsQuery implements Query<CampaignInvitationDTO[]> {
  public constructor(public readonly input: ListCurrentUserCampaignInvitationsInput) {}
}
