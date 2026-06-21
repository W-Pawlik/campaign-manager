import type { Command } from "@core/application/cqrs/Command";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";

export interface UpdateQuestInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
  title?: string;
  description?: string | null;
  status?: string;
  type?: string;
  visibility?: string;
  priority?: string;
  giverNpcId?: string | null;
  relatedLocationId?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  failedAt?: Date | null;
  rewardDescription?: string | null;
  gmNotes?: string | null;
}

export class UpdateQuestCommand implements Command<QuestDetailsDTO> {
  public constructor(public readonly input: UpdateQuestInput) {}
}
