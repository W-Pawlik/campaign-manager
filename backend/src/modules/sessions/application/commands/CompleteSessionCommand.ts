import type { Command } from "@core/application/cqrs/Command";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";

export interface CompleteSessionInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
}

export class CompleteSessionCommand implements Command<SessionDetailsDTO> {
  public constructor(public readonly input: CompleteSessionInput) {}
}
