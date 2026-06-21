import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { AddQuestObjectiveCommand } from "@modules/quests/application/commands/AddQuestObjectiveCommand";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import { mapQuestObjectiveDtoFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import { ObjectiveStatus } from "@modules/quests/domain/value-objects/ObjectiveStatus";

export class AddQuestObjectiveHandler implements CommandHandler<AddQuestObjectiveCommand, QuestObjectiveDTO> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly questReadRepository: QuestReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: AddQuestObjectiveCommand): Promise<QuestObjectiveDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    const existingObjectives = await this.questReadRepository.listQuestObjectives(
      command.input.campaignId,
      command.input.questId,
    );
    const createdAt = new Date();
    const objective = QuestObjective.create({
      id: randomUUID(),
      questId: quest.id,
      title: command.input.title.trim(),
      description: command.input.description ?? null,
      status:
        command.input.status === undefined ? ObjectiveStatus.todo() : ObjectiveStatus.create(command.input.status),
      sortOrder: command.input.sortOrder ?? existingObjectives.length,
      createdAt,
      updatedAt: createdAt,
    });

    await this.questRepository.createObjective(objective);

    return mapQuestObjectiveDtoFromDomain(objective);
  }
}
