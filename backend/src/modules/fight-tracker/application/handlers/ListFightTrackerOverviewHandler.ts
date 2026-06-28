import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { FightTrackerOverviewDTO } from "@modules/fight-tracker/application/dto/FightTrackerOverviewDTO";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";
import type { ListFightTrackerOverviewQuery } from "@modules/fight-tracker/application/queries/ListFightTrackerOverviewQuery";

export class ListFightTrackerOverviewHandler
  implements QueryHandler<ListFightTrackerOverviewQuery, FightTrackerOverviewDTO>
{
  public constructor(
    private readonly readRepository: FightTrackerReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(query: ListFightTrackerOverviewQuery): Promise<FightTrackerOverviewDTO> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_VIEW,
    );

    return this.readRepository.getOverview(query.input.campaignId);
  }
}
