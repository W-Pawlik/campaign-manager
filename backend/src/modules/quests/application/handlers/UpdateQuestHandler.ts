import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UpdateQuestCommand } from "@modules/quests/application/commands/UpdateQuestCommand";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import { mapQuestDetailsFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestRelatedEntityApplicationService } from "@modules/quests/application/services/QuestRelatedEntityApplicationService";
import { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

export class UpdateQuestHandler implements CommandHandler<UpdateQuestCommand, QuestDetailsDTO> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly questReadRepository: QuestReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly relatedEntityService: QuestRelatedEntityApplicationService,
  ) {}

  public async execute(command: UpdateQuestCommand): Promise<QuestDetailsDTO> {
    if (
      command.input.title === undefined &&
      command.input.description === undefined &&
      command.input.status === undefined &&
      command.input.type === undefined &&
      command.input.visibility === undefined &&
      command.input.priority === undefined &&
      command.input.giverNpcId === undefined &&
      command.input.relatedLocationId === undefined &&
      command.input.startedAt === undefined &&
      command.input.completedAt === undefined &&
      command.input.failedAt === undefined &&
      command.input.rewardDescription === undefined &&
      command.input.gmNotes === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    await this.relatedEntityService.validateQuestReferences({
      campaignId: command.input.campaignId,
      giverNpcId: command.input.giverNpcId === undefined ? quest.giverNpcId : command.input.giverNpcId,
      relatedLocationId:
        command.input.relatedLocationId === undefined ? quest.relatedLocationId : command.input.relatedLocationId,
    });

    let updatedQuest = quest.withUpdates({
      ...(command.input.title === undefined ? {} : { title: command.input.title.trim() }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(command.input.type === undefined ? {} : { type: QuestType.create(command.input.type) }),
      ...(command.input.visibility === undefined
        ? {}
        : { visibility: QuestVisibility.create(command.input.visibility) }),
      ...(command.input.priority === undefined ? {} : { priority: QuestPriority.create(command.input.priority) }),
      ...(command.input.giverNpcId === undefined ? {} : { giverNpcId: command.input.giverNpcId }),
      ...(command.input.relatedLocationId === undefined
        ? {}
        : { relatedLocationId: command.input.relatedLocationId }),
      ...(command.input.startedAt === undefined ? {} : { startedAt: command.input.startedAt }),
      ...(command.input.completedAt === undefined ? {} : { completedAt: command.input.completedAt }),
      ...(command.input.failedAt === undefined ? {} : { failedAt: command.input.failedAt }),
      ...(command.input.rewardDescription === undefined
        ? {}
        : { rewardDescription: command.input.rewardDescription }),
      ...(command.input.gmNotes === undefined ? {} : { gmNotes: command.input.gmNotes }),
    });

    if (command.input.status !== undefined) {
      updatedQuest = updatedQuest.changeStatus(QuestStatus.create(command.input.status), new Date());
    }

    await this.questRepository.save(updatedQuest);

    const details = await this.questReadRepository.getQuestDetails(command.input.campaignId, command.input.questId);

    return mapQuestDetailsFromDomain(
      updatedQuest,
      details?.objectives ?? [],
      details?.relations ?? [],
      access.role,
      this.visibilityService,
    );
  }
}
