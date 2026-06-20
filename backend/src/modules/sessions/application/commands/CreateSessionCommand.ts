import type { Command } from "@core/application/cqrs/Command";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";

export interface CreateSessionInput {
  campaignId: string;
  actorUserId: string;
  title: string;
  description?: string | null;
  status?: string;
  scheduledStartAt?: Date | null;
  scheduledEndAt?: Date | null;
  actualStartAt?: Date | null;
  actualEndAt?: Date | null;
  locationType?: string | null;
  locationDetails?: string | null;
  meetingUrl?: string | null;
  summaryPublic?: string | null;
  summaryPrivate?: string | null;
}

export class CreateSessionCommand implements Command<SessionDetailsDTO> {
  public constructor(public readonly input: CreateSessionInput) {}
}
