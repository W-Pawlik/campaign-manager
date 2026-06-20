import type { Query } from "@core/application/cqrs/Query";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";

export interface ListSessionParticipantsInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
}

export class ListSessionParticipantsQuery implements Query<SessionParticipantDTO[]> {
  public constructor(public readonly input: ListSessionParticipantsInput) {}
}
