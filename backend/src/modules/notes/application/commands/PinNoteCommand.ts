import type { Command } from "@core/application/cqrs/Command";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface PinNoteInput {
  campaignId: string;
  noteId: string;
  actorUserId: string;
}

export class PinNoteCommand implements Command<NoteViewDTO> {
  public constructor(public readonly input: PinNoteInput) {}
}
