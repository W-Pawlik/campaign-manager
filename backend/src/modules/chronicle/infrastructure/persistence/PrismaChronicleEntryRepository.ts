import type { PrismaClient } from "@prisma/client";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import type {
  ChronicleEntryMapper,
  ChronicleEntryPersistenceRecord,
} from "@modules/chronicle/infrastructure/persistence/ChronicleEntryMapper";

interface ChronicleEntryDelegate {
  findFirst(args: unknown): Promise<ChronicleEntryPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  deleteMany(args: unknown): Promise<unknown>;
}

export class PrismaChronicleEntryRepository implements ChronicleEntryRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ChronicleEntryMapper,
  ) {}

  public async findById(campaignId: string, entryId: string): Promise<ChronicleEntry | null> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryDelegate };
    const entry = await chronicleClient.chronicleEntry.findFirst({
      where: {
        id: entryId,
        campaignId,
      },
    });

    return entry === null ? null : this.mapper.toDomain(entry);
  }

  public async create(entry: ChronicleEntry): Promise<void> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryDelegate };
    await chronicleClient.chronicleEntry.create({
      data: this.mapper.toPersistenceCreate(entry),
    });
  }

  public async save(entry: ChronicleEntry): Promise<void> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryDelegate };
    await chronicleClient.chronicleEntry.update({
      where: { id: entry.id },
      data: this.mapper.toPersistenceUpdate(entry),
    });
  }

  public async delete(campaignId: string, entryId: string): Promise<void> {
    const chronicleClient = this.prismaClient as PrismaClient & { chronicleEntry: ChronicleEntryDelegate };
    await chronicleClient.chronicleEntry.deleteMany({
      where: {
        id: entryId,
        campaignId,
      },
    });
  }
}
