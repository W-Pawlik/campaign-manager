import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";

export class ChronicleVisibilityApplicationService {
  public constructor(
    private readonly campaignVisibilityService: CampaignVisibilityApplicationService,
  ) {}

  public canViewEntry(entry: ChronicleEntry, role: CampaignRole, actorUserId: string): boolean {
    if (entry.visibility.isPublic()) {
      return true;
    }

    if (entry.visibility.isGmOnly()) {
      return this.campaignVisibilityService.canSeeSecretContent(role);
    }

    if (entry.visibility.isDraft()) {
      return this.campaignVisibilityService.canSeeSecretContent(role) || entry.createdById === actorUserId;
    }

    return false;
  }
}
