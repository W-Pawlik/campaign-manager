import { Note } from "@modules/notes/domain/entities/Note";
import { NoteCategory } from "@modules/notes/domain/value-objects/NoteCategory";
import { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export interface NotePersistenceRecord {
  id: string;
  campaignId: string;
  authorId: string;
  title: string | null;
  content: string;
  visibility: string;
  category: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class NoteMapper {
  public toDomain(prismaNote: NotePersistenceRecord): Note {
    return Note.create({
      id: prismaNote.id,
      campaignId: prismaNote.campaignId,
      authorId: prismaNote.authorId,
      title: prismaNote.title,
      content: prismaNote.content,
      visibility: NoteVisibility.create(prismaNote.visibility),
      category: NoteCategory.create(prismaNote.category),
      relatedEntityType:
        prismaNote.relatedEntityType === null
          ? null
          : RelatedEntityType.create(prismaNote.relatedEntityType),
      relatedEntityId: prismaNote.relatedEntityId,
      isPinned: prismaNote.isPinned,
      createdAt: prismaNote.createdAt,
      updatedAt: prismaNote.updatedAt,
      deletedAt: prismaNote.deletedAt,
    });
  }

  public toPersistenceCreate(note: Note): Record<string, unknown> {
    return {
      id: note.id,
      campaignId: note.campaignId,
      authorId: note.authorId,
      title: note.title,
      content: note.content,
      visibility: note.visibility.value,
      category: note.category.value,
      relatedEntityType: note.relatedEntityType?.value ?? null,
      relatedEntityId: note.relatedEntityId,
      isPinned: note.isPinned,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      deletedAt: note.deletedAt,
    };
  }

  public toPersistenceUpdate(note: Note): Record<string, unknown> {
    return this.toPersistenceCreate(note);
  }
}
