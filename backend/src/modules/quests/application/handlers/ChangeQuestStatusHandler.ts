import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { ChangeQuestStatusCommand } from "@modules/quests/application/commands/ChangeQuestStatusCommand";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import { mapQuestDetailsFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";

export class ChangeQuestStatusHandler implements CommandHandler<ChangeQuestStatusCommand, QuestDetailsDTO> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly questReadRepository: QuestReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: ChangeQuestStatusCommand): Promise<QuestDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    const updatedQuest = quest.changeStatus(QuestStatus.create(command.input.status), new Date());
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
