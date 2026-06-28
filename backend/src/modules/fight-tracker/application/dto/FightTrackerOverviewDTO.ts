import type { FightEncounterHistoryItemDTO } from "@modules/fight-tracker/application/dto/FightEncounterHistoryItemDTO";
import type { FightEncounterListItemDTO } from "@modules/fight-tracker/application/dto/FightEncounterListItemDTO";

export interface FightTrackerOverviewDTO {
  encounters: FightEncounterListItemDTO[];
  history: FightEncounterHistoryItemDTO[];
}
