import type { Note } from "@modules/notes/domain/entities/Note";

export interface NoteRepository {
  findById(campaignId: string, noteId: string): Promise<Note | null>;
  create(note: Note): Promise<void>;
  save(note: Note): Promise<void>;
}
