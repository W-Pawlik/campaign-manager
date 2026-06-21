import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";

export function mapChronicleEntryDtoFromDomain(entry: ChronicleEntry): ChronicleEntryDTO {
  return {
    id: entry.id,
    campaignId: entry.campaignId,
    sessionId: entry.sessionId,
    title: entry.title,
    content: entry.content,
    inWorldDate: entry.inWorldDate,
    occurredAt: entry.occurredAt?.toISOString() ?? null,
    visibility: entry.visibility.value,
    createdById: entry.createdById,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
