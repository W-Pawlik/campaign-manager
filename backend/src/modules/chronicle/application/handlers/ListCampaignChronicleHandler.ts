import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntryReadRepository } from "@modules/chronicle/application/ports/ChronicleEntryReadRepository";
import type { ListCampaignChronicleQuery } from "@modules/chronicle/application/queries/ListCampaignChronicleQuery";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import type { ChronicleVisibilityApplicationService } from "@modules/chronicle/application/services/ChronicleVisibilityApplicationService";

export class ListCampaignChronicleHandler
  implements QueryHandler<ListCampaignChronicleQuery, ChronicleEntryDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly chronicleReadRepository: ChronicleEntryReadRepository,
    private readonly visibilityService: ChronicleVisibilityApplicationService,
  ) {}

  public async execute(query: ListCampaignChronicleQuery): Promise<ChronicleEntryDTO[]> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const entries = await this.chronicleReadRepository.listCampaignChronicle(query.input.campaignId);

    return entries
      .filter((entry) => this.visibilityService.canViewEntry(entry, access.role, query.input.actorUserId))
      .map(mapChronicleEntryDtoFromDomain);
  }
}
