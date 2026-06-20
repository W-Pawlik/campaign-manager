import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";

export interface SessionListItemDTO {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  locationType: string | null;
  locationDetails: string | null;
  meetingUrl: string | null;
  summaryPublic: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface SessionPlayerViewDTO extends SessionListItemDTO {
  participants: SessionParticipantDTO[];
}

export interface SessionGmViewDTO extends SessionPlayerViewDTO {
  summaryPrivate: string | null;
}

export type SessionDetailsDTO = SessionPlayerViewDTO | SessionGmViewDTO;
