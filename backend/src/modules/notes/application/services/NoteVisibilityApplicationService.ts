import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { Note } from "@modules/notes/domain/entities/Note";
import type { NoteRelatedEntityApplicationService } from "@modules/notes/application/services/NoteRelatedEntityApplicationService";

export class NoteVisibilityApplicationService {
  public constructor(
    private readonly campaignVisibilityService: CampaignVisibilityApplicationService,
    private readonly relatedEntityService: NoteRelatedEntityApplicationService,
  ) {}

  public async canViewNote(note: Note, role: CampaignRole, actorUserId: string): Promise<boolean> {
    if (role.canSeeFullCampaign()) {
      return true;
    }

    if (note.visibility.isPrivateGm()) {
      return this.campaignVisibilityService.canSeeSecretContent(role);
    }

    if (note.visibility.isPrivateAuthor()) {
      return note.authorId === actorUserId;
    }

    if (note.visibility.isCharacterOwner()) {
      if (note.relatedEntityType === null || note.relatedEntityId === null || !note.relatedEntityType.isCharacter()) {
        return false;
      }

      return this.relatedEntityService.isCharacterOwner(
        note.campaignId,
        note.relatedEntityId,
        actorUserId,
      );
    }

    if (note.visibility.isSessionPublic()) {
      return true;
    }

    return true;
  }
}
