import type { CampaignNote } from "@/features/campaigns";

export type NoteVisibility =
  | "PRIVATE_AUTHOR"
  | "PRIVATE_GM"
  | "CAMPAIGN_PUBLIC"
  | "SESSION_PUBLIC"
  | "CHARACTER_OWNER";

export type NoteCategory =
  | "GENERAL"
  | "SESSION"
  | "CHARACTER"
  | "QUEST"
  | "LOCATION"
  | "NPC"
  | "ITEM"
  | "LORE"
  | "GM_SECRET"
  | "PLAYER_NOTE";

export type RelatedEntityType =
  | "CAMPAIGN"
  | "SESSION"
  | "CHARACTER"
  | "NPC"
  | "QUEST"
  | "LOCATION"
  | "ITEM"
  | "CHRONICLE_ENTRY";

export type NoteDetails = CampaignNote;

export type CreateNotePayload = {
  title?: string | null;
  content: string;
  visibility?: NoteVisibility;
  category?: NoteCategory;
  relatedEntityType?: RelatedEntityType | null;
  relatedEntityId?: string | null;
};

export type UpdateNotePayload = Partial<CreateNotePayload>;

export const noteVisibilityOptions: NoteVisibility[] = [
  "PRIVATE_AUTHOR",
  "PRIVATE_GM",
  "CAMPAIGN_PUBLIC",
  "SESSION_PUBLIC",
  "CHARACTER_OWNER",
];

export const noteCategoryOptions: NoteCategory[] = [
  "GENERAL",
  "SESSION",
  "CHARACTER",
  "QUEST",
  "LOCATION",
  "NPC",
  "ITEM",
  "LORE",
  "GM_SECRET",
  "PLAYER_NOTE",
];

export const relatedEntityTypeOptions: RelatedEntityType[] = [
  "CAMPAIGN",
  "SESSION",
  "CHARACTER",
  "NPC",
  "QUEST",
  "LOCATION",
  "ITEM",
  "CHRONICLE_ENTRY",
];
