import type { Command } from "@core/application/cqrs/Command";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";

export interface UpdateFightEncounterRunStateCommandInput {
  campaignId: string;
  runId: string;
  actorUserId: string;
  roundsCompleted: number;
  durationSeconds: number | null;
  stateData?: unknown | null;
}

export class UpdateFightEncounterRunStateCommand implements Command<FightEncounterRunDTO> {
  public constructor(public readonly input: UpdateFightEncounterRunStateCommandInput) {}
}
