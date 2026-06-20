import type { Query } from "@core/application/cqrs/Query";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";

export interface GetLocationDetailsInput {
  campaignId: string;
  locationId: string;
  actorUserId: string;
}

export class GetLocationDetailsQuery implements Query<LocationViewDTO> {
  public constructor(public readonly input: GetLocationDetailsInput) {}
}
