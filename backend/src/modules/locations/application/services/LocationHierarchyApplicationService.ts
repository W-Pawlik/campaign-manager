import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";

export class LocationHierarchyApplicationService {
  public constructor(private readonly locationReadRepository: LocationReadRepository) {}

  public async ensureParentIsValid(
    campaignId: string,
    parentLocationId: string | null,
    currentLocationId?: string,
  ): Promise<void> {
    if (parentLocationId === null) {
      return;
    }

    if (currentLocationId !== undefined && currentLocationId === parentLocationId) {
      throw new ValidationError("Location cannot be its own parent");
    }

    const locations = await this.locationReadRepository.listCampaignLocations(campaignId);
    const parentLocation = locations.find((location) => location.id === parentLocationId);

    if (parentLocation === undefined) {
      throw new ValidationError("Parent location must belong to the same campaign");
    }

    if (currentLocationId === undefined) {
      return;
    }

    const parentIdsByLocationId = new Map(
      locations.map((location) => [location.id, location.parentLocationId] as const),
    );
    let cursor: string | null = parentLocationId;
    const visitedIds = new Set<string>();

    while (cursor !== null) {
      if (cursor === currentLocationId) {
        throw new ValidationError("Location hierarchy cannot contain cycles");
      }

      if (visitedIds.has(cursor)) {
        throw new ValidationError("Location hierarchy cannot contain cycles");
      }

      visitedIds.add(cursor);
      cursor = parentIdsByLocationId.get(cursor) ?? null;
    }
  }

  public async ensureHasNoChildren(campaignId: string, locationId: string): Promise<void> {
    const locations = await this.locationReadRepository.listCampaignLocations(campaignId);
    const hasChildren = locations.some((location) => location.parentLocationId === locationId);

    if (hasChildren) {
      throw new ForbiddenError("Location with child locations cannot be deleted");
    }
  }
}
