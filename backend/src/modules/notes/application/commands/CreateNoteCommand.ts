import type { Command } from "@core/application/cqrs/Command";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface CreateNoteInput {
  campaignId: string;
  actorUserId: string;
  title?: string | null;
  content: string;
  visibility?: string;
  category?: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export class CreateNoteCommand implements Command<NoteViewDTO> {
  public constructor(public readonly input: CreateNoteInput) {}
}
