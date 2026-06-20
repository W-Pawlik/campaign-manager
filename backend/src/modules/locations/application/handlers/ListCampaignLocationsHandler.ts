import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { ListCampaignLocationsQuery } from "@modules/locations/application/queries/ListCampaignLocationsQuery";
import { canViewLocation } from "@modules/locations/application/services/LocationVisibilityPolicy";
import { mapLocationViewFromDomain } from "@modules/locations/application/services/LocationViewDtoMapper";

export class ListCampaignLocationsHandler
  implements QueryHandler<ListCampaignLocationsQuery, LocationViewDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async execute(query: ListCampaignLocationsQuery): Promise<LocationViewDTO[]> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const locations = await this.locationReadRepository.listCampaignLocations(query.input.campaignId);

    return locations
      .filter((location) => canViewLocation(location, access.role, this.visibilityService))
      .map((location) => mapLocationViewFromDomain(location, access.role, this.visibilityService));
  }
}
