import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";

export class NotePermissionDomainService {
  public canManageNote(actorRole: CampaignRole, actorUserId: string, authorId: string): boolean {
    if (actorUserId === authorId) {
      return true;
    }

    return actorRole.canSeeFullCampaign();
  }

  public canSetVisibility(actorRole: CampaignRole, visibility: NoteVisibility): boolean {
    if (!visibility.isPrivateGm()) {
      return true;
    }

    return actorRole.canSeeFullCampaign();
  }
}
