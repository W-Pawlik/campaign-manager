import type { CampaignChronicleEntry } from "@/features/campaigns";

export type ChronicleVisibility = "PUBLIC" | "GM_ONLY" | "DRAFT";

export type ChronicleEntryDetails = CampaignChronicleEntry;

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
