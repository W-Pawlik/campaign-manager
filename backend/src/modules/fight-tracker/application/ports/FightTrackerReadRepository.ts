import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";
import type { FightTrackerOverviewDTO } from "@modules/fight-tracker/application/dto/FightTrackerOverviewDTO";

export interface FightTrackerReadRepository {
  getOverview(campaignId: string): Promise<FightTrackerOverviewDTO>;
  getEncounterDetails(campaignId: string, encounterId: string): Promise<FightEncounterDetailsDTO | null>;
}
