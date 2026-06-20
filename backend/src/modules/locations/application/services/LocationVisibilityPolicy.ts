import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { Location } from "@modules/locations/domain/entities/Location";

export function canViewLocation(
  location: Location,
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): boolean {
  return !location.visibility.isGmOnly() || visibilityService.canSeeHiddenLocation(role);
}
