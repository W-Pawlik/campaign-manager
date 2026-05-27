import type { Query } from "@core/application/cqrs/Query";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";

export interface ListCampaignMembersInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignMembersQuery implements Query<CampaignMemberDTO[]> {
  public constructor(public readonly input: ListCampaignMembersInput) {}
}
