import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { LocationTreeNodeDTO } from "@modules/locations/application/dto/LocationTreeNodeDTO";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { GetLocationTreeQuery } from "@modules/locations/application/queries/GetLocationTreeQuery";
import { buildLocationTree } from "@modules/locations/application/services/LocationTreeBuilder";
import { canViewLocation } from "@modules/locations/application/services/LocationVisibilityPolicy";

export class GetLocationTreeHandler implements QueryHandler<GetLocationTreeQuery, LocationTreeNodeDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async execute(query: GetLocationTreeQuery): Promise<LocationTreeNodeDTO[]> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const locations = await this.locationReadRepository.listCampaignLocations(query.input.campaignId);
    const visibleLocations = locations.filter((location) =>
      canViewLocation(location, access.role, this.visibilityService),
    );

    return buildLocationTree(visibleLocations, access.role, this.visibilityService);
  }
}
