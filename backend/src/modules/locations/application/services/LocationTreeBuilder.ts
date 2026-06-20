import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { LocationTreeNodeDTO } from "@modules/locations/application/dto/LocationTreeNodeDTO";
import { mapLocationTreeNode } from "@modules/locations/application/services/LocationViewDtoMapper";
import type { Location } from "@modules/locations/domain/entities/Location";

export function buildLocationTree(
  locations: Location[],
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): LocationTreeNodeDTO[] {
  const childrenByParentId = new Map<string | null, Location[]>();

  for (const location of locations) {
    const siblings = childrenByParentId.get(location.parentLocationId) ?? [];

    siblings.push(location);
    childrenByParentId.set(location.parentLocationId, siblings);
  }

  const sortLocations = (items: Location[]): Location[] =>
    [...items].sort((left, right) => {
      if (left.name === right.name) {
        return left.createdAt.getTime() - right.createdAt.getTime();
      }

      return left.name.localeCompare(right.name);
    });

  const buildNode = (location: Location): LocationTreeNodeDTO => {
    const children = sortLocations(childrenByParentId.get(location.id) ?? []).map(buildNode);

    return mapLocationTreeNode(location, children, role, visibilityService);
  };

  return sortLocations(childrenByParentId.get(null) ?? []).map(buildNode);
}
