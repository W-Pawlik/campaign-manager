import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { UpdateCharacterCommand } from "@modules/characters/application/commands/UpdateCharacterCommand";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { mapCharacterDetailsFromDomain } from "@modules/characters/application/services/CharacterDtoMapper";
import type { CharacterPermissionDomainService } from "@modules/characters/domain/services/CharacterPermissionDomainService";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class UpdateCharacterHandler
  implements CommandHandler<UpdateCharacterCommand, CharacterDetailsDTO>
{
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: CharacterPermissionDomainService,
  ) {}

  public async execute(command: UpdateCharacterCommand): Promise<CharacterDetailsDTO> {
    if (
      command.input.ownerUserId === undefined &&
      command.input.sheetTemplateId === undefined &&
      command.input.name === undefined &&
      command.input.avatarUrl === undefined &&
      command.input.type === undefined &&
      command.input.status === undefined &&
      command.input.race === undefined &&
      command.input.characterClass === undefined &&
      command.input.subclass === undefined &&
      command.input.level === undefined &&
      command.input.background === undefined &&
      command.input.alignment === undefined &&
      command.input.experiencePoints === undefined &&
      command.input.armorClass === undefined &&
      command.input.initiativeBonus === undefined &&
      command.input.speed === undefined &&
      command.input.maxHitPoints === undefined &&
      command.input.currentHitPoints === undefined &&
      command.input.temporaryHitPoints === undefined &&
      command.input.hitDice === undefined &&
      command.input.strength === undefined &&
      command.input.dexterity === undefined &&
      command.input.constitution === undefined &&
      command.input.intelligence === undefined &&
      command.input.wisdom === undefined &&
      command.input.charisma === undefined &&
      command.input.proficiencyBonus === undefined &&
      command.input.savingThrows === undefined &&
      command.input.skills === undefined &&
      command.input.proficiencies === undefined &&
      command.input.languages === undefined &&
      command.input.attacksAndSpellcasting === undefined &&
      command.input.spellcasting === undefined &&
      command.input.featuresAndTraits === undefined &&
      command.input.personalityTraits === undefined &&
      command.input.ideals === undefined &&
      command.input.bonds === undefined &&
      command.input.flaws === undefined &&
      command.input.backstory === undefined &&
      command.input.appearance === undefined &&
      command.input.customData === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHARACTER_UPDATE,
    );
    const character = await this.characterRepository.findById(
      command.input.campaignId,
      command.input.characterId,
    );

    if (character === null) {
      throw new NotFoundError("Character not found");
    }

    if (!this.permissionService.canManageCharacter(access.role, command.input.actorUserId, character)) {
      throw new ForbiddenError("You can only edit your own character");
    }

    if (
      command.input.ownerUserId !== undefined &&
      command.input.ownerUserId !== character.ownerUserId &&
      !this.permissionService.canAssignCharacterOwner(
        access.role,
        command.input.actorUserId,
        command.input.ownerUserId,
      )
    ) {
      throw new ForbiddenError("Only campaign staff can change character owner");
    }

    const updatedCharacter = character.withUpdates({
      ...(command.input.ownerUserId === undefined ? {} : { ownerUserId: command.input.ownerUserId }),
      ...(command.input.sheetTemplateId === undefined
        ? {}
        : { sheetTemplateId: command.input.sheetTemplateId }),
      ...(command.input.name === undefined ? {} : { name: command.input.name.trim() }),
      ...(command.input.avatarUrl === undefined ? {} : { avatarUrl: command.input.avatarUrl }),
      ...(command.input.type === undefined ? {} : { type: CharacterType.create(command.input.type) }),
      ...(command.input.status === undefined
        ? {}
        : { status: CharacterStatus.create(command.input.status) }),
      ...(command.input.race === undefined ? {} : { race: command.input.race }),
      ...(command.input.characterClass === undefined
        ? {}
        : { characterClass: command.input.characterClass }),
      ...(command.input.subclass === undefined ? {} : { subclass: command.input.subclass }),
      ...(command.input.level === undefined ? {} : { level: command.input.level }),
      ...(command.input.background === undefined ? {} : { background: command.input.background }),
      ...(command.input.alignment === undefined ? {} : { alignment: command.input.alignment }),
      ...(command.input.experiencePoints === undefined
        ? {}
        : { experiencePoints: command.input.experiencePoints }),
      ...(command.input.armorClass === undefined ? {} : { armorClass: command.input.armorClass }),
      ...(command.input.initiativeBonus === undefined
        ? {}
        : { initiativeBonus: command.input.initiativeBonus }),
      ...(command.input.speed === undefined ? {} : { speed: command.input.speed }),
      ...(command.input.maxHitPoints === undefined
        ? {}
        : { maxHitPoints: command.input.maxHitPoints }),
      ...(command.input.currentHitPoints === undefined
        ? {}
        : { currentHitPoints: command.input.currentHitPoints }),
      ...(command.input.temporaryHitPoints === undefined
        ? {}
        : { temporaryHitPoints: command.input.temporaryHitPoints }),
      ...(command.input.hitDice === undefined ? {} : { hitDice: command.input.hitDice }),
      ...(command.input.strength === undefined ? {} : { strength: command.input.strength }),
      ...(command.input.dexterity === undefined ? {} : { dexterity: command.input.dexterity }),
      ...(command.input.constitution === undefined
        ? {}
        : { constitution: command.input.constitution }),
      ...(command.input.intelligence === undefined
        ? {}
        : { intelligence: command.input.intelligence }),
      ...(command.input.wisdom === undefined ? {} : { wisdom: command.input.wisdom }),
      ...(command.input.charisma === undefined ? {} : { charisma: command.input.charisma }),
      ...(command.input.proficiencyBonus === undefined
        ? {}
        : { proficiencyBonus: command.input.proficiencyBonus }),
      ...(command.input.savingThrows === undefined
        ? {}
        : { savingThrows: command.input.savingThrows }),
      ...(command.input.skills === undefined ? {} : { skills: command.input.skills }),
      ...(command.input.proficiencies === undefined
        ? {}
        : { proficiencies: command.input.proficiencies }),
      ...(command.input.languages === undefined ? {} : { languages: command.input.languages }),
      ...(command.input.attacksAndSpellcasting === undefined
        ? {}
        : { attacksAndSpellcasting: command.input.attacksAndSpellcasting }),
      ...(command.input.spellcasting === undefined
        ? {}
        : { spellcasting: command.input.spellcasting }),
      ...(command.input.featuresAndTraits === undefined
        ? {}
        : { featuresAndTraits: command.input.featuresAndTraits }),
      ...(command.input.personalityTraits === undefined
        ? {}
        : { personalityTraits: command.input.personalityTraits }),
      ...(command.input.ideals === undefined ? {} : { ideals: command.input.ideals }),
      ...(command.input.bonds === undefined ? {} : { bonds: command.input.bonds }),
      ...(command.input.flaws === undefined ? {} : { flaws: command.input.flaws }),
      ...(command.input.backstory === undefined ? {} : { backstory: command.input.backstory }),
      ...(command.input.appearance === undefined ? {} : { appearance: command.input.appearance }),
      ...(command.input.customData === undefined ? {} : { customData: command.input.customData }),
    });

    await this.characterRepository.save(updatedCharacter);

    return mapCharacterDetailsFromDomain(updatedCharacter);
  }
}
