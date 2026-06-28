import type { Command } from "@core/application/cqrs/Command";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";

export interface FinishFightEncounterRunCommandInput {
  campaignId: string;
  runId: string;
  actorUserId: string;
  roundsCompleted: number;
  durationSeconds: number;
  outcomeLabel: string;
  summaryData?: unknown | null;
}

export class FinishFightEncounterRunCommand implements Command<FightEncounterRunDTO> {
  public constructor(public readonly input: FinishFightEncounterRunCommandInput) {}
}
