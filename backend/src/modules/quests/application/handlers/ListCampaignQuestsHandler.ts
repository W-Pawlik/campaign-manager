import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ListCampaignQuestsQuery } from "@modules/quests/application/queries/ListCampaignQuestsQuery";
import type { QuestListItemDTO } from "@modules/quests/application/dto/QuestListItemDTO";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import { mapQuestListItemFromDomain } from "@modules/quests/application/services/QuestDtoMapper";
import type { QuestVisibilityApplicationService } from "@modules/quests/application/services/QuestVisibilityApplicationService";

export class ListCampaignQuestsHandler implements QueryHandler<ListCampaignQuestsQuery, QuestListItemDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly questReadRepository: QuestReadRepository,
    private readonly visibilityService: QuestVisibilityApplicationService,
  ) {}

  public async execute(query: ListCampaignQuestsQuery): Promise<QuestListItemDTO[]> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const quests = await this.questReadRepository.listCampaignQuests(query.input.campaignId);

    return quests
      .filter((quest) => this.visibilityService.canViewQuest(quest, access.role))
      .map(mapQuestListItemFromDomain);
  }
}
