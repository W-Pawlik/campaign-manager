import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import type { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export class ChroniclePermissionDomainService {
  public canManageEntry(actorRole: CampaignRole, actorUserId: string, entry: ChronicleEntry): boolean {
    if (actorRole.canSeeFullCampaign()) {
      return true;
    }

    return entry.createdById === actorUserId;
  }

  public canSetVisibility(actorRole: CampaignRole, _actorUserId: string, visibility: ChronicleVisibility): boolean {
    if (visibility.isPublic() || visibility.isDraft()) {
      return true;
    }

    if (visibility.isGmOnly()) {
      return actorRole.canSeeFullCampaign();
    }

    return false;
  }
}
