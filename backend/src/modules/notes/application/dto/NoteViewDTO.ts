export interface NoteViewDTO {
  id: string;
  campaignId: string;
  authorId: string;
  title: string | null;
  content: string;
  visibility: string;
  category: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
