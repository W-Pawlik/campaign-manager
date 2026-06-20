import type { Query } from "@core/application/cqrs/Query";
import type { LocationTreeNodeDTO } from "@modules/locations/application/dto/LocationTreeNodeDTO";

export interface GetLocationTreeInput {
  campaignId: string;
  actorUserId: string;
}

export class GetLocationTreeQuery implements Query<LocationTreeNodeDTO[]> {
  public constructor(public readonly input: GetLocationTreeInput) {}
}
