import type { CampaignChronicleEntry } from "@/features/campaigns";

export type ChronicleVisibility = "PUBLIC" | "GM_ONLY" | "DRAFT";

export type ChronicleSyncState =
  | "SYNCED"
  | "PENDING_CREATE"
  | "PENDING_UPDATE"
  | "PENDING_DELETE"
  | "CONFLICT";

export type ChronicleConflictReason = "REMOTE_UPDATED" | "SYNC_FAILED";

export type ChronicleOfflineMeta = {
  conflictReason: ChronicleConflictReason | null;
  hasServerVersion: boolean;
  syncState: ChronicleSyncState;
};

export type ChronicleEntryView = CampaignChronicleEntry & {
  offlineMeta?: ChronicleOfflineMeta;
};

export type ChronicleEntryDetails = ChronicleEntryView;

export type CreateChronicleEntryPayload = {
  sessionId?: string | null;
  title: string;
  content: string;
  inWorldDate?: string | null;
  occurredAt?: string | null;
  visibility?: ChronicleVisibility;
};

export type UpdateChronicleEntryPayload = Partial<CreateChronicleEntryPayload>;

export const chronicleVisibilityOptions: ChronicleVisibility[] = ["PUBLIC", "GM_ONLY", "DRAFT"];
