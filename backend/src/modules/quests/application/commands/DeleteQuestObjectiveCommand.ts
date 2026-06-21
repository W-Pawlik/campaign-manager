import type { Command } from "@core/application/cqrs/Command";

export interface DeleteQuestObjectiveInput {
  campaignId: string;
  questId: string;
  objectiveId: string;
  actorUserId: string;
}

export class DeleteQuestObjectiveCommand implements Command<void> {
  public constructor(public readonly input: DeleteQuestObjectiveInput) {}
}
