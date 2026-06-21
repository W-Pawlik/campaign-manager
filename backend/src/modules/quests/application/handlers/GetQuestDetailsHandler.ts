import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { QuestDetailsDTO } from "@modules/quests/application/dto/QuestDetailsDTO";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import type { GetQuestDetailsQuery } from "@modules/quests/application/queries/GetQuestDetailsQuery";
import { mapQuestDetailsFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestVisibilityApplicationService } from "@modules/quests/application/services/QuestVisibilityApplicationService";

export class GetQuestDetailsHandler implements QueryHandler<GetQuestDetailsQuery, QuestDetailsDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly campaignVisibilityService: CampaignVisibilityApplicationService,
    private readonly questReadRepository: QuestReadRepository,
    private readonly questVisibilityService: QuestVisibilityApplicationService,
  ) {}

  public async execute(query: GetQuestDetailsQuery): Promise<QuestDetailsDTO> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const details = await this.questReadRepository.getQuestDetails(query.input.campaignId, query.input.questId);

    if (details === null || !this.questVisibilityService.canViewQuest(details.quest, access.role)) {
      throw new NotFoundError("Quest not found");
    }

    return mapQuestDetailsFromDomain(
      details.quest,
      details.objectives,
      details.relations,
      access.role,
      this.campaignVisibilityService,
    );
  }
}
