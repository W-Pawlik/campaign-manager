import type { Query } from "@core/application/cqrs/Query";
import type { FightTrackerOverviewDTO } from "@modules/fight-tracker/application/dto/FightTrackerOverviewDTO";

export interface ListFightTrackerOverviewQueryInput {
  campaignId: string;
  actorUserId: string;
}

export class ListFightTrackerOverviewQuery implements Query<FightTrackerOverviewDTO> {
  public constructor(public readonly input: ListFightTrackerOverviewQueryInput) {}
}
