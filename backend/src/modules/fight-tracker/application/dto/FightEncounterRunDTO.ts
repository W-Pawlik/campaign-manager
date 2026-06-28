export interface FightEncounterRunDTO {
  id: string;
  encounterId: string;
  campaignId: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  stateData: unknown | null;
}
