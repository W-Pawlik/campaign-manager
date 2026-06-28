import type { Command } from "@core/application/cqrs/Command";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";

export interface UpdateFightEncounterCommandInput {
  campaignId: string;
  encounterId: string;
  actorUserId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData?: unknown | null;
}

export class UpdateFightEncounterCommand implements Command<FightEncounterDetailsDTO> {
  public constructor(public readonly input: UpdateFightEncounterCommandInput) {}
}
