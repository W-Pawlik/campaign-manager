import { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export interface ChronicleEntryPersistenceRecord {
  id: string;
  campaignId: string;
  sessionId: string | null;
  title: string;
  content: string;
  inWorldDate: string | null;
  occurredAt: Date | null;
  visibility: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChronicleEntryMapper {
  public toDomain(record: ChronicleEntryPersistenceRecord): ChronicleEntry {
    return ChronicleEntry.create({
      id: record.id,
      campaignId: record.campaignId,
      sessionId: record.sessionId,
      title: record.title,
      content: record.content,
      inWorldDate: record.inWorldDate,
      occurredAt: record.occurredAt,
      visibility: ChronicleVisibility.create(record.visibility),
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public toPersistenceCreate(entry: ChronicleEntry): Record<string, unknown> {
    return {
      id: entry.id,
      campaignId: entry.campaignId,
      sessionId: entry.sessionId,
      title: entry.title,
      content: entry.content,
      inWorldDate: entry.inWorldDate,
      occurredAt: entry.occurredAt,
      visibility: entry.visibility.value,
      createdById: entry.createdById,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  public toPersistenceUpdate(entry: ChronicleEntry): Record<string, unknown> {
    return this.toPersistenceCreate(entry);
  }
}
