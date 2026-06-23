import type { CampaignNpcListItem } from "@/features/campaigns";

export type NpcAttitude = "FRIENDLY" | "NEUTRAL" | "HOSTILE" | "UNKNOWN";
export type NpcImportance = "MINOR" | "SUPPORTING" | "MAJOR" | "BOSS";
export type NpcStatus = "ALIVE" | "DEAD" | "MISSING" | "UNKNOWN" | "ARCHIVED";

export type CampaignNpcDetails = CampaignNpcListItem & {
  gmNotes?: string | null;
  motivations?: string | null;
  secrets?: string | null;
  createdById?: string;
};

export type CreateNpcPayload = {
  name: string;
  title?: string | null;
  avatarUrl?: string | null;
  race?: string | null;
  occupation?: string | null;
  faction?: string | null;
  locationId?: string | null;
  attitude?: NpcAttitude;
  importance?: NpcImportance;
  status?: NpcStatus;
  publicDescription?: string | null;
  gmNotes?: string | null;
  appearance?: string | null;
  personality?: string | null;
  motivations?: string | null;
  secrets?: string | null;
  statBlock?: unknown | null;
  externalReferenceId?: string | null;
};

export type UpdateNpcPayload = Partial<CreateNpcPayload>;

export const npcAttitudeOptions: NpcAttitude[] = ["FRIENDLY", "NEUTRAL", "HOSTILE", "UNKNOWN"];
export const npcImportanceOptions: NpcImportance[] = ["MINOR", "SUPPORTING", "MAJOR", "BOSS"];
export const npcStatusOptions: NpcStatus[] = ["ALIVE", "DEAD", "MISSING", "UNKNOWN", "ARCHIVED"];
