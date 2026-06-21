import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";
import type { LinkQuestEntityCommand } from "@modules/quests/application/commands/LinkQuestEntityCommand";
import type { QuestRelationDTO } from "@modules/quests/application/dto/QuestRelationDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { mapQuestRelationDtoFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestRelatedEntityApplicationService } from "@modules/quests/application/services/QuestRelatedEntityApplicationService";
import { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";

export class LinkQuestEntityHandler implements CommandHandler<LinkQuestEntityCommand, QuestRelationDTO> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly relatedEntityService: QuestRelatedEntityApplicationService,
  ) {}

  public async execute(command: LinkQuestEntityCommand): Promise<QuestRelationDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    const entityType = RelatedEntityType.create(command.input.entityType);
    await this.relatedEntityService.validateRelation({
      campaignId: command.input.campaignId,
      entityType,
      entityId: command.input.entityId,
    });

    const relation = QuestRelation.create({
      id: randomUUID(),
      questId: quest.id,
      entityType,
      entityId: command.input.entityId,
      relationType: command.input.relationType.trim(),
      createdAt: new Date(),
    });

    await this.questRepository.createRelation(relation);

    return mapQuestRelationDtoFromDomain(relation);
  }
}
