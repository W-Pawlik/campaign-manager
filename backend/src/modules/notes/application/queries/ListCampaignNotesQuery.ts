import type { Query } from "@core/application/cqrs/Query";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";

export interface ListCampaignNotesInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignNotesQuery implements Query<NoteViewDTO[]> {
  public constructor(public readonly input: ListCampaignNotesInput) {}
}
