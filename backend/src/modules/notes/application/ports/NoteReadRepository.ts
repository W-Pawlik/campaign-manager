import type { Note } from "@modules/notes/domain/entities/Note";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export interface NoteReadRepository {
  listCampaignNotes(campaignId: string): Promise<Note[]>;
  getNoteDetails(campaignId: string, noteId: string): Promise<Note | null>;
  listRelatedNotes(campaignId: string, relatedEntityType: RelatedEntityType, relatedEntityId: string): Promise<Note[]>;
}
