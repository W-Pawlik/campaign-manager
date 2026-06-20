import type { PrismaClient } from "@prisma/client";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import type { Note } from "@modules/notes/domain/entities/Note";
import type { NoteMapper, NotePersistenceRecord } from "@modules/notes/infrastructure/persistence/NoteMapper";

interface NoteDelegate {
  findFirst(args: unknown): Promise<NotePersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaNoteRepository implements NoteRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: NoteMapper,
  ) {}

  public async findById(campaignId: string, noteId: string): Promise<Note | null> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteDelegate };
    const note = await noteClient.note.findFirst({
      where: {
        id: noteId,
        campaignId,
        deletedAt: null,
      },
    });

    return note === null ? null : this.mapper.toDomain(note);
  }

  public async create(note: Note): Promise<void> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteDelegate };

    await noteClient.note.create({
      data: this.mapper.toPersistenceCreate(note),
    });
  }

  public async save(note: Note): Promise<void> {
    const noteClient = this.prismaClient as PrismaClient & { note: NoteDelegate };

    await noteClient.note.update({
      where: { id: note.id },
      data: this.mapper.toPersistenceUpdate(note),
    });
  }
}
