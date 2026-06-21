import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";

export interface ChronicleEntryReadRepository {
  listCampaignChronicle(campaignId: string): Promise<ChronicleEntry[]>;
  getChronicleEntryDetails(campaignId: string, entryId: string): Promise<ChronicleEntry | null>;
}
