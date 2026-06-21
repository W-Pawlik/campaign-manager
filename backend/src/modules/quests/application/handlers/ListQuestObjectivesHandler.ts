import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import type { ListQuestObjectivesQuery } from "@modules/quests/application/queries/ListQuestObjectivesQuery";
import { mapQuestObjectiveDtoFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestVisibilityApplicationService } from "@modules/quests/application/services/QuestVisibilityApplicationService";

export class ListQuestObjectivesHandler
  implements QueryHandler<ListQuestObjectivesQuery, QuestObjectiveDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly questReadRepository: QuestReadRepository,
    private readonly visibilityService: QuestVisibilityApplicationService,
  ) {}

  public async execute(query: ListQuestObjectivesQuery): Promise<QuestObjectiveDTO[]> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const details = await this.questReadRepository.getQuestDetails(query.input.campaignId, query.input.questId);

    if (details === null || !this.visibilityService.canViewQuest(details.quest, access.role)) {
      throw new NotFoundError("Quest not found");
    }

    return details.objectives.map(mapQuestObjectiveDtoFromDomain);
  }
}
