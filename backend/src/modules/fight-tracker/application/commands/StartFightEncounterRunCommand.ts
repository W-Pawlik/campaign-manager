import type { Command } from "@core/application/cqrs/Command";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";

export interface StartFightEncounterRunCommandInput {
  campaignId: string;
  encounterId: string;
  actorUserId: string;
}

export class StartFightEncounterRunCommand implements Command<FightEncounterRunDTO> {
  public constructor(public readonly input: StartFightEncounterRunCommandInput) {}
}
