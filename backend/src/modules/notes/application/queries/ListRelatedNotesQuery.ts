import type { Query } from "@core/application/cqrs/Query";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface ListRelatedNotesInput {
  campaignId: string;
  actorUserId: string;
  relatedEntityType: string;
  relatedEntityId: string;
}

export class ListRelatedNotesQuery implements Query<NoteViewDTO[]> {
  public constructor(public readonly input: ListRelatedNotesInput) {}
}
