import type { Command } from "@core/application/cqrs/Command";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";

export interface CreateFightEncounterCommandInput {
  campaignId: string;
  actorUserId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount?: number;
  conditionCount?: number;
  preparationData?: unknown | null;
}

export class CreateFightEncounterCommand implements Command<FightEncounterDetailsDTO> {
  public constructor(public readonly input: CreateFightEncounterCommandInput) {}
}
