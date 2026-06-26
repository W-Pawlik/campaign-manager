import type { CampaignSessionListItem } from "@/features/campaigns";

export type SessionStatus =
  | "PLANNED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED";

export type SessionLocationType = "ONLINE" | "IN_PERSON" | "HYBRID" | "UNKNOWN";

export type SessionParticipant = {
  id: string;
  sessionId: string;
  userId: string;
  username?: string | null;
  avatarUrl?: string | null;
  characterId: string | null;
  attendanceStatus: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignSessionDetails = CampaignSessionListItem & {
  participants: SessionParticipant[];
  summaryPrivate?: string | null;
};

export type CreateSessionPayload = {
  title: string;
  description?: string | null;
  status?: SessionStatus;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  locationType?: SessionLocationType | null;
  locationDetails?: string | null;
  meetingUrl?: string | null;
  summaryPublic?: string | null;
  summaryPrivate?: string | null;
};

export type UpdateSessionPayload = Partial<CreateSessionPayload>;

export const sessionStatusOptions: SessionStatus[] = [
  "PLANNED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
];

export const sessionLocationTypeOptions: SessionLocationType[] = [
  "ONLINE",
  "IN_PERSON",
  "HYBRID",
  "UNKNOWN",
];
