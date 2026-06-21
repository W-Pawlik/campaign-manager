import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntryReadRepository } from "@modules/chronicle/application/ports/ChronicleEntryReadRepository";
import type { GetChronicleEntryDetailsQuery } from "@modules/chronicle/application/queries/GetChronicleEntryDetailsQuery";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import type { ChronicleVisibilityApplicationService } from "@modules/chronicle/application/services/ChronicleVisibilityApplicationService";

export class GetChronicleEntryDetailsHandler
  implements QueryHandler<GetChronicleEntryDetailsQuery, ChronicleEntryDTO>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly chronicleReadRepository: ChronicleEntryReadRepository,
    private readonly visibilityService: ChronicleVisibilityApplicationService,
  ) {}

  public async execute(query: GetChronicleEntryDetailsQuery): Promise<ChronicleEntryDTO> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const entry = await this.chronicleReadRepository.getChronicleEntryDetails(
      query.input.campaignId,
      query.input.entryId,
    );

    if (
      entry === null ||
      !this.visibilityService.canViewEntry(entry, access.role, query.input.actorUserId)
    ) {
      throw new NotFoundError("Chronicle entry not found");
    }

    return mapChronicleEntryDtoFromDomain(entry);
  }
}
