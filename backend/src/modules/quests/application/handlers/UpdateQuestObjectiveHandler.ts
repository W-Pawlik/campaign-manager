import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UpdateQuestObjectiveCommand } from "@modules/quests/application/commands/UpdateQuestObjectiveCommand";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { mapQuestObjectiveDtoFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import { ObjectiveStatus } from "@modules/quests/domain/value-objects/ObjectiveStatus";

export class UpdateQuestObjectiveHandler
  implements CommandHandler<UpdateQuestObjectiveCommand, QuestObjectiveDTO>
{
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UpdateQuestObjectiveCommand): Promise<QuestObjectiveDTO> {
    if (
      command.input.title === undefined &&
      command.input.description === undefined &&
      command.input.status === undefined &&
      command.input.sortOrder === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

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

    const updatedObjective = objective.withUpdates({
      ...(command.input.title === undefined ? {} : { title: command.input.title.trim() }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(command.input.status === undefined ? {} : { status: ObjectiveStatus.create(command.input.status) }),
      ...(command.input.sortOrder === undefined ? {} : { sortOrder: command.input.sortOrder }),
    });

    await this.questRepository.saveObjective(updatedObjective);

    return mapQuestObjectiveDtoFromDomain(updatedObjective);
  }
}
