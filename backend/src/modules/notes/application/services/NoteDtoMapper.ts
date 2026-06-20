import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { Note } from "@modules/notes/domain/entities/Note";

export function mapNoteViewFromDomain(note: Note): NoteViewDTO {
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
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}
