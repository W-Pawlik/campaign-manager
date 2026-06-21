import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { DeleteQuestObjectiveCommand } from "@modules/quests/application/commands/DeleteQuestObjectiveCommand";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";

export class DeleteQuestObjectiveHandler implements CommandHandler<DeleteQuestObjectiveCommand, void> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: DeleteQuestObjectiveCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    const objective = await this.questRepository.findObjectiveById(command.input.questId, command.input.objectiveId);

    if (objective === null) {
      throw new NotFoundError("Quest objective not found");
    }

    await this.questRepository.deleteObjective(command.input.questId, command.input.objectiveId);
  }
}
