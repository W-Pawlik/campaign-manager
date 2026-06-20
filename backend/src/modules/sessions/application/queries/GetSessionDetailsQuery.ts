import type { Query } from "@core/application/cqrs/Query";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";

export interface GetSessionDetailsInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
}

export class GetSessionDetailsQuery implements Query<SessionDetailsDTO> {
  public constructor(public readonly input: GetSessionDetailsInput) {}
}
