import type { PrismaClient } from "@prisma/client";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import type { Note } from "@modules/notes/domain/entities/Note";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";
import type { NoteMapper, NotePersistenceRecord } from "@modules/notes/infrastructure/persistence/NoteMapper";

interface NoteReadDelegate {
  findMany(args: unknown): Promise<NotePersistenceRecord[]>;
  findFirst(args: unknown): Promise<NotePersistenceRecord | null>;
}

export class PrismaNoteReadRepository implements NoteReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: NoteMapper,
  ) {}

  public async listCampaignNotes(campaignId: string): Promise<Note[]> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteReadDelegate };
    const notes = await noteClient.note.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      orderBy: [
        { isPinned: "desc" },
        { updatedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return notes.map((note) => this.mapper.toDomain(note));
  }

  public async getNoteDetails(campaignId: string, noteId: string): Promise<Note | null> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteReadDelegate };
    const note = await noteClient.note.findFirst({
      where: {
        id: noteId,
        campaignId,
        deletedAt: null,
      },
    });

    return note === null ? null : this.mapper.toDomain(note);
  }

  public async listRelatedNotes(
    campaignId: string,
    relatedEntityType: RelatedEntityType,
    relatedEntityId: string,
  ): Promise<Note[]> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteReadDelegate };
    const notes = await noteClient.note.findMany({
      where: {
        campaignId,
        relatedEntityType: relatedEntityType.value,
        relatedEntityId,
        deletedAt: null,
      },
      orderBy: [
        { isPinned: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return notes.map((note) => this.mapper.toDomain(note));
  }
}
