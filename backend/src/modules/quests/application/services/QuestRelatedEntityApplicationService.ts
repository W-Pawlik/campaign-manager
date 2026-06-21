import { ValidationError } from "@core/application/errors/AppError";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";

export class QuestRelatedEntityApplicationService {
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly npcRepository: NpcRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  public async validateQuestReferences(options: {
    campaignId: string;
    giverNpcId: string | null;
    relatedLocationId: string | null;
  }): Promise<void> {
    if (options.giverNpcId !== null) {
      const npc = await this.npcRepository.findById(options.campaignId, options.giverNpcId);

      if (npc === null) {
        throw new ValidationError("Quest giver NPC not found in campaign");
      }
    }

    if (options.relatedLocationId !== null) {
      const location = await this.locationRepository.findById(options.campaignId, options.relatedLocationId);

      if (location === null) {
        throw new ValidationError("Quest related location not found in campaign");
      }
    }
  }

  public async validateRelation(options: {
    campaignId: string;
    entityType: RelatedEntityType;
    entityId: string;
  }): Promise<void> {
    if (options.entityType.isCharacter()) {
      const character = await this.characterRepository.findById(options.campaignId, options.entityId);

      if (character === null) {
        throw new ValidationError("Related quest character not found in campaign");
      }

      return;
    }

    if (options.entityType.isNpc()) {
      const npc = await this.npcRepository.findById(options.campaignId, options.entityId);

      if (npc === null) {
        throw new ValidationError("Related quest NPC not found in campaign");
      }

      return;
    }

    if (options.entityType.isLocation()) {
      const location = await this.locationRepository.findById(options.campaignId, options.entityId);

      if (location === null) {
        throw new ValidationError("Related quest location not found in campaign");
      }

      return;
    }

    if (options.entityType.value === "ITEM") {
      return;
    }

    throw new ValidationError("Unsupported quest relation entity type");
  }
}
