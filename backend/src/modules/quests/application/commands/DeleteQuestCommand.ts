import type { Command } from "@core/application/cqrs/Command";

export interface DeleteQuestInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
}

export class DeleteQuestCommand implements Command<void> {
  public constructor(public readonly input: DeleteQuestInput) {}
}
