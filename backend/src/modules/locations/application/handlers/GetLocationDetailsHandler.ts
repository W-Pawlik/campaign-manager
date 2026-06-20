import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { GetLocationDetailsQuery } from "@modules/locations/application/queries/GetLocationDetailsQuery";
import { canViewLocation } from "@modules/locations/application/services/LocationVisibilityPolicy";
import { mapLocationViewFromDomain } from "@modules/locations/application/services/LocationViewDtoMapper";

export class GetLocationDetailsHandler
  implements QueryHandler<GetLocationDetailsQuery, LocationViewDTO>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async execute(query: GetLocationDetailsQuery): Promise<LocationViewDTO> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const location = await this.locationReadRepository.getLocationDetails(
      query.input.campaignId,
      query.input.locationId,
    );

    if (
      location === null ||
      !canViewLocation(location, access.role, this.visibilityService)
    ) {
      throw new NotFoundError("Location not found");
    }

    return mapLocationViewFromDomain(location, access.role, this.visibilityService);
  }
}
