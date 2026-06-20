import type { Command } from "@core/application/cqrs/Command";

export interface CancelSessionInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
}

export class CancelSessionCommand implements Command<void> {
  public constructor(public readonly input: CancelSessionInput) {}
}
