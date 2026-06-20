import type { Command } from "@core/application/cqrs/Command";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface UnpinNoteInput {
  campaignId: string;
  noteId: string;
  actorUserId: string;
}

export class UnpinNoteCommand implements Command<NoteViewDTO> {
  public constructor(public readonly input: UnpinNoteInput) {}
}
