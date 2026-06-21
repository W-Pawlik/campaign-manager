import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateQuestCommand } from "@modules/quests/application/commands/CreateQuestCommand";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { mapQuestDetailsFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestRelatedEntityApplicationService } from "@modules/quests/application/services/QuestRelatedEntityApplicationService";
import { Quest } from "@modules/quests/domain/entities/Quest";
import { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

export class CreateQuestHandler implements CommandHandler<CreateQuestCommand, QuestDetailsDTO> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly relatedEntityService: QuestRelatedEntityApplicationService,
  ) {}

  public async execute(command: CreateQuestCommand): Promise<QuestDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );

    await this.relatedEntityService.validateQuestReferences({
      campaignId: command.input.campaignId,
      giverNpcId: command.input.giverNpcId ?? null,
      relatedLocationId: command.input.relatedLocationId ?? null,
    });

    const createdAt = new Date();
    const quest = Quest.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      title: command.input.title.trim(),
      description: command.input.description ?? null,
      status: command.input.status === undefined ? QuestStatus.draft() : QuestStatus.create(command.input.status),
      type: command.input.type === undefined ? QuestType.side() : QuestType.create(command.input.type),
      visibility:
        command.input.visibility === undefined
          ? QuestVisibility.public()
          : QuestVisibility.create(command.input.visibility),
      priority:
        command.input.priority === undefined
          ? QuestPriority.normal()
          : QuestPriority.create(command.input.priority),
      giverNpcId: command.input.giverNpcId ?? null,
      relatedLocationId: command.input.relatedLocationId ?? null,
      startedAt: command.input.startedAt ?? null,
      completedAt: command.input.completedAt ?? null,
      failedAt: command.input.failedAt ?? null,
      rewardDescription: command.input.rewardDescription ?? null,
      gmNotes: command.input.gmNotes ?? null,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.questRepository.create(quest);

    return mapQuestDetailsFromDomain(quest, [], [], access.role, this.visibilityService);
  }
}
