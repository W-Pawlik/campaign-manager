import type { PrismaClient } from "@prisma/client";
import type { ChronicleEntryReadRepository } from "@modules/chronicle/application/ports/ChronicleEntryReadRepository";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import type {
  ChronicleEntryMapper,
  ChronicleEntryPersistenceRecord,
} from "@modules/chronicle/infrastructure/persistence/ChronicleEntryMapper";

interface ChronicleEntryReadDelegate {
  findMany(args: unknown): Promise<ChronicleEntryPersistenceRecord[]>;
  findFirst(args: unknown): Promise<ChronicleEntryPersistenceRecord | null>;
}

export class PrismaChronicleEntryReadRepository implements ChronicleEntryReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ChronicleEntryMapper,
  ) {}

  public async listCampaignChronicle(campaignId: string): Promise<ChronicleEntry[]> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryReadDelegate };
    const entries = await chronicleClient.chronicleEntry.findMany({
      where: {
        campaignId,
      },
      orderBy: [
        { occurredAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return entries.map((entry) => this.mapper.toDomain(entry));
  }

  public async getChronicleEntryDetails(campaignId: string, entryId: string): Promise<ChronicleEntry | null> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryReadDelegate };
    const entry = await chronicleClient.chronicleEntry.findFirst({
      where: {
        id: entryId,
        campaignId,
      },
    });

    return entry === null ? null : this.mapper.toDomain(entry);
  }
}
