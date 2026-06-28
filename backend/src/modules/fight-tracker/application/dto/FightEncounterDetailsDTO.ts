import type { FightEncounterHistoryItemDTO } from "@modules/fight-tracker/application/dto/FightEncounterHistoryItemDTO";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";

export interface FightEncounterDetailsDTO {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: unknown | null;
  createdAt: string;
  updatedAt: string;
  activeRun: FightEncounterRunDTO | null;
  history: FightEncounterHistoryItemDTO[];
}
