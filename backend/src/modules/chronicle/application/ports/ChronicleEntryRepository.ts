import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";

export interface ChronicleEntryRepository {
  findById(campaignId: string, entryId: string): Promise<ChronicleEntry | null>;
  create(entry: ChronicleEntry): Promise<void>;
  save(entry: ChronicleEntry): Promise<void>;
  delete(campaignId: string, entryId: string): Promise<void>;
}
