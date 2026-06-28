import type { Query } from "@core/application/cqrs/Query";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";

export interface GetFightEncounterDetailsQueryInput {
  campaignId: string;
  encounterId: string;
  actorUserId: string;
}

export class GetFightEncounterDetailsQuery implements Query<FightEncounterDetailsDTO> {
  public constructor(public readonly input: GetFightEncounterDetailsQueryInput) {}
}
