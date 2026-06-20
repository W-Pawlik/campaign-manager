import type { Command } from "@core/application/cqrs/Command";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface UpdateNoteInput {
  campaignId: string;
  noteId: string;
  actorUserId: string;
  title?: string | null;
  content?: string;
  visibility?: string;
  category?: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export class UpdateNoteCommand implements Command<NoteViewDTO> {
  public constructor(public readonly input: UpdateNoteInput) {}
}
