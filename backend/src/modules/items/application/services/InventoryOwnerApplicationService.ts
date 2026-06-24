import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";

export class InventoryOwnerApplicationService {
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly npcRepository: NpcRepository,
    private readonly locationRepository: LocationRepository,
    private readonly questRepository: QuestRepository,
    private readonly sessionRepository: GameSessionRepository,
  ) {}

  public async validateOwnerExists(
    campaignId: string,
    ownerType: InventoryOwnerType,
    ownerId: string,
  ): Promise<void> {
    if (ownerType.isCampaignParty()) {
      if (ownerId !== campaignId) {
        throw new ValidationError("Campaign party inventory owner id must equal campaign id");
      }

      return;
    }

    if (ownerType.isCharacter()) {
      const character = await this.characterRepository.findById(campaignId, ownerId);

      if (character === null) {
        throw new ValidationError("Inventory owner character not found in campaign");
      }

      return;
    }

    if (ownerType.isNpc()) {
      const npc = await this.npcRepository.findById(campaignId, ownerId);

      if (npc === null) {
        throw new ValidationError("Inventory owner NPC not found in campaign");
      }

      return;
    }

    if (ownerType.isLocation()) {
      const location = await this.locationRepository.findById(campaignId, ownerId);

      if (location === null) {
        throw new ValidationError("Inventory owner location not found in campaign");
      }

      return;
    }

    if (ownerType.isQuest()) {
      const quest = await this.questRepository.findById(campaignId, ownerId);

      if (quest === null) {
        throw new ValidationError("Inventory owner quest not found in campaign");
      }

      return;
    }

    if (ownerType.isSession()) {
      const session = await this.sessionRepository.findById(campaignId, ownerId);

      if (session === null) {
        throw new ValidationError("Inventory owner session not found in campaign");
      }
    }
  }

  public async assertCanManageOwner(options: {
    campaignId: string;
    ownerType: InventoryOwnerType;
    ownerId: string;
    actorUserId: string;
    actorRole: CampaignRole;
  }): Promise<void> {
    if (options.actorRole.canSeeFullCampaign()) {
      return;
    }

    if (!options.ownerType.isCharacter()) {
      throw new ForbiddenError("Only campaign staff can manage this inventory owner");
    }

    const character = await this.characterRepository.findById(options.campaignId, options.ownerId);

    if (character === null) {
      throw new ValidationError("Inventory owner character not found in campaign");
    }

    if (character.ownerUserId !== options.actorUserId) {
      throw new ForbiddenError("You can only manage inventory of your own character");
    }
  }

  public async canViewOwner(options: {
    campaignId: string;
    ownerType: InventoryOwnerType;
    ownerId: string;
    actorUserId: string;
    actorRole: CampaignRole;
  }): Promise<boolean> {
    if (options.actorRole.canSeeFullCampaign()) {
      return true;
    }

    if (!options.ownerType.isCharacter()) {
      return false;
    }

    const character = await this.characterRepository.findById(options.campaignId, options.ownerId);

    return character?.ownerUserId === options.actorUserId;
  }
}
