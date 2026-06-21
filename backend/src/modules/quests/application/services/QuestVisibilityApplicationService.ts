import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { Quest } from "@modules/quests/domain/entities/Quest";

export class QuestVisibilityApplicationService {
  public constructor(
    private readonly campaignVisibilityService: CampaignVisibilityApplicationService,
  ) {}

  public canViewQuest(quest: Quest, role: CampaignRole): boolean {
    if (this.campaignVisibilityService.canSeeSecretContent(role)) {
      return true;
    }

    if (quest.status.isHidden()) {
      return false;
    }

    return !quest.visibility.isGmOnly();
  }
}
