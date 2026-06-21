import type { Command } from "@core/application/cqrs/Command";
import type { QuestRelationDTO } from "@modules/quests/application/dto/QuestRelationDTO";

export interface LinkQuestEntityInput {
  campaignId: string;
  questId: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  relationType: string;
}

export class LinkQuestEntityCommand implements Command<QuestRelationDTO> {
  public constructor(public readonly input: LinkQuestEntityInput) {}
}
