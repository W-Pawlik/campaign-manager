import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { LocationGmTreeNodeDTO, LocationTreeNodeDTO } from "@modules/locations/application/dto/LocationTreeNodeDTO";
import type { LocationGmViewDTO } from "@modules/locations/application/dto/LocationGmViewDTO";
import type { LocationPlayerTreeNodeDTO } from "@modules/locations/application/dto/LocationTreeNodeDTO";
import type { LocationPlayerViewDTO } from "@modules/locations/application/dto/LocationPlayerViewDTO";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";
import type { Location } from "@modules/locations/domain/entities/Location";

export function mapLocationPlayerViewFromDomain(location: Location): LocationPlayerViewDTO {
  return {
    id: location.id,
    campaignId: location.campaignId,
    parentLocationId: location.parentLocationId,
    name: location.name,
    type: location.type.value,
    shortDescription: location.shortDescription,
    description: location.description,
    mapImageUrl: location.mapImageUrl,
    coordinates: location.coordinates,
    status: location.status.value,
    visibility: location.visibility.value,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  };
}

export function mapLocationGmViewFromDomain(location: Location): LocationGmViewDTO {
  return {
    ...mapLocationPlayerViewFromDomain(location),
    gmNotes: location.gmNotes,
    createdById: location.createdById,
  };
}

export function mapLocationViewFromDomain(
  location: Location,
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): LocationViewDTO {
  return visibilityService.canSeeSecretContent(role)
    ? mapLocationGmViewFromDomain(location)
    : mapLocationPlayerViewFromDomain(location);
}

export function mapLocationTreeNode(
  location: Location,
  children: LocationTreeNodeDTO[],
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): LocationTreeNodeDTO {
  if (visibilityService.canSeeSecretContent(role)) {
    const dto: LocationGmTreeNodeDTO = {
      ...mapLocationGmViewFromDomain(location),
      children: children as LocationGmTreeNodeDTO[],
    };

    return dto;
  }

  const dto: LocationPlayerTreeNodeDTO = {
    ...mapLocationPlayerViewFromDomain(location),
    children: children as LocationPlayerTreeNodeDTO[],
  };

  return dto;
}
