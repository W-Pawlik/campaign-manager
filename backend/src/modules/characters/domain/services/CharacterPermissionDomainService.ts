import type { Character } from "@modules/characters/domain/entities/Character";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

export class CharacterPermissionDomainService {
  public canManageCharacter(
    actorRole: CampaignRole,
    actorUserId: string,
    character: Character,
  ): boolean {
    if (actorRole.canSeeFullCampaign()) {
      return true;
    }

    return character.ownerUserId === actorUserId;
  }

  public canAssignCharacterOwner(actorRole: CampaignRole, actorUserId: string, ownerUserId: string | null): boolean {
    if (ownerUserId === actorUserId) {
      return true;
    }

    if (ownerUserId === null) {
      return actorRole.canSeeFullCampaign();
    }

    return actorRole.canSeeFullCampaign();
  }
}
