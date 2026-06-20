import type { Query } from "@core/application/cqrs/Query";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface GetNoteDetailsInput {
  campaignId: string;
  noteId: string;
  actorUserId: string;
}

export class GetNoteDetailsQuery implements Query<NoteViewDTO> {
  public constructor(public readonly input: GetNoteDetailsInput) {}
}
