import type { FightEncounter } from "@modules/fight-tracker/domain/entities/FightEncounter";
import type { FightEncounterRun } from "@modules/fight-tracker/domain/entities/FightEncounterRun";

export interface FightEncounterRepository {
  createEncounter(encounter: FightEncounter): Promise<void>;
  findEncounterById(campaignId: string, encounterId: string): Promise<FightEncounter | null>;
  saveEncounter(encounter: FightEncounter): Promise<void>;
  archiveEncounter(encounter: FightEncounter): Promise<void>;
  createRun(run: FightEncounterRun): Promise<void>;
  findActiveRunByEncounterId(campaignId: string, encounterId: string): Promise<FightEncounterRun | null>;
  findRunById(campaignId: string, runId: string): Promise<FightEncounterRun | null>;
  saveRun(run: FightEncounterRun): Promise<void>;
}
