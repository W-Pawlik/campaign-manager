export interface FightEncounterHistoryItemDTO {
  runId: string;
  encounterId: string;
  encounterName: string;
  environmentName: string;
  status: string;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  startedAt: string;
  finishedAt: string | null;
}
