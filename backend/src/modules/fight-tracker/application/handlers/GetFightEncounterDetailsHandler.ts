import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";
import type { GetFightEncounterDetailsQuery } from "@modules/fight-tracker/application/queries/GetFightEncounterDetailsQuery";

export class GetFightEncounterDetailsHandler
  implements QueryHandler<GetFightEncounterDetailsQuery, FightEncounterDetailsDTO>
{
  public constructor(
    private readonly readRepository: FightTrackerReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(query: GetFightEncounterDetailsQuery): Promise<FightEncounterDetailsDTO> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_VIEW,
    );

    const details = await this.readRepository.getEncounterDetails(
      query.input.campaignId,
      query.input.encounterId,
    );

    if (details === null) {
      throw new NotFoundError("Fight encounter not found");
    }

    return details;
  }
}
