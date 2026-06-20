import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export class NoteRelatedEntityApplicationService {
  public constructor(private readonly characterRepository: CharacterRepository) {}

  public async validateReferenceAndVisibility(options: {
    campaignId: string;
    actorUserId: string;
    actorRole: CampaignRole;
    relatedEntityType: RelatedEntityType | null;
    relatedEntityId: string | null;
    visibility: NoteVisibility;
  }): Promise<void> {
    if (options.visibility.isCharacterOwner()) {
      if (options.relatedEntityType === null || !options.relatedEntityType.isCharacter()) {
        throw new ValidationError("CHARACTER_OWNER visibility requires CHARACTER related entity");
      }

      if (options.relatedEntityId === null) {
        throw new ValidationError("CHARACTER_OWNER visibility requires related entity id");
      }
    }

    if (options.relatedEntityType?.isCharacter() && options.relatedEntityId !== null) {
      const character = await this.characterRepository.findById(
        options.campaignId,
        options.relatedEntityId,
      );

      if (character === null) {
        throw new ValidationError("Related character not found in campaign");
      }

      if (options.visibility.isCharacterOwner()) {
        if (character.ownerUserId === null) {
          throw new ValidationError("CHARACTER_OWNER visibility requires character with owner");
        }

        if (!options.actorRole.canSeeFullCampaign() && character.ownerUserId !== options.actorUserId) {
          throw new ForbiddenError("Only character owner or campaign staff can use CHARACTER_OWNER visibility");
        }
      }
    }
  }

  public async isCharacterOwner(campaignId: string, characterId: string, userId: string): Promise<boolean> {
    const character = await this.characterRepository.findById(campaignId, characterId);

    return character?.ownerUserId === userId;
  }
}
