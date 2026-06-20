import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

type SecretFieldFilter<T> = (value: T) => T;

export class CampaignVisibilityApplicationService {
  public constructor(private readonly permissionService: CampaignPermissionDomainService) {}

  public canSeeSecretContent(role: CampaignRole): boolean {
    return this.permissionService.canSeeSecretContent(role);
  }

  public canSeeHiddenLocation(role: CampaignRole): boolean {
    return this.permissionService.can(role, CAMPAIGN_PERMISSION_ACTION.LOCATION_READ_HIDDEN);
  }

  public filterSecretValue<T>(value: T, role: CampaignRole): T | null {
    return this.canSeeSecretContent(role) ? value : null;
  }

  public filterSecretFields<T>(
    value: T,
    role: CampaignRole,
    filter: SecretFieldFilter<T>,
  ): T {
    return this.canSeeSecretContent(role) ? value : filter(value);
  }
}
