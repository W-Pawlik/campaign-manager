import type { Query } from "@core/application/cqrs/Query";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";

export interface ListCampaignLocationsInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignLocationsQuery implements Query<LocationViewDTO[]> {
  public constructor(public readonly input: ListCampaignLocationsInput) {}
}
