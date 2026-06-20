import type { Command } from "@core/application/cqrs/Command";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";

export interface ConfirmSessionAttendanceInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
}

export class ConfirmSessionAttendanceCommand implements Command<SessionParticipantDTO> {
  public constructor(public readonly input: ConfirmSessionAttendanceInput) {}
}
