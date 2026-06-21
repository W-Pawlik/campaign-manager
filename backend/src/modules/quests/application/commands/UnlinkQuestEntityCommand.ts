import type { Command } from "@core/application/cqrs/Command";

export interface UnlinkQuestEntityInput {
  campaignId: string;
  questId: string;
  relationId: string;
  actorUserId: string;
}

export class UnlinkQuestEntityCommand implements Command<void> {
  public constructor(public readonly input: UnlinkQuestEntityInput) {}
}
