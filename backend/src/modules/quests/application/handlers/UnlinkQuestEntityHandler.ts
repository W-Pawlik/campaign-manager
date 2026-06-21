import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UnlinkQuestEntityCommand } from "@modules/quests/application/commands/UnlinkQuestEntityCommand";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";

export class UnlinkQuestEntityHandler implements CommandHandler<UnlinkQuestEntityCommand, void> {
  public constructor(
    private readonly questRepository: QuestRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UnlinkQuestEntityCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.QUEST_UPDATE,
    );
    const quest = await this.questRepository.findById(command.input.campaignId, command.input.questId);

    if (quest === null) {
      throw new NotFoundError("Quest not found");
    }

    await this.questRepository.deleteRelation(command.input.questId, command.input.relationId);
  }
}
