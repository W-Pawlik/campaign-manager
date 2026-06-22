import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { Monster } from "@modules/monsters/domain/entities/Monster";

export class MonsterVisibilityApplicationService {
  public canViewMonster(monster: Monster, role: CampaignRole): boolean {
    if (role.canSeeFullCampaign()) {
      return true;
    }

    return monster.visibility.isPublic();
  }
}
