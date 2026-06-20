import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { CreateCharacterCommand } from "@modules/characters/application/commands/CreateCharacterCommand";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { mapCharacterDetailsFromDomain } from "@modules/characters/application/services/CharacterDtoMapper";
import { Character } from "@modules/characters/domain/entities/Character";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class CreateCharacterHandler
  implements CommandHandler<CreateCharacterCommand, CharacterDetailsDTO>
{
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: CreateCharacterCommand): Promise<CharacterDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHARACTER_CREATE,
    );

    const type =
      command.input.type === undefined
        ? CharacterType.playerCharacter()
        : CharacterType.create(command.input.type);
    const requestedOwnerUserId = command.input.ownerUserId ?? command.input.actorUserId;
    const ownerUserId = requestedOwnerUserId === null ? null : requestedOwnerUserId;

    if (
      command.input.ownerUserId !== undefined &&
      ownerUserId !== command.input.actorUserId &&
      !access.role.canSeeFullCampaign()
    ) {
      throw new ForbiddenError("Only campaign staff can create characters for other users");
    }

    if (ownerUserId === null && !access.role.canSeeFullCampaign()) {
      throw new ForbiddenError("Only campaign staff can create unowned characters");
    }

    const createdAt = new Date();
    const character = Character.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      ownerUserId,
      sheetTemplateId: command.input.sheetTemplateId ?? null,
      name: command.input.name.trim(),
      avatarUrl: command.input.avatarUrl ?? null,
      type,
      status:
        command.input.status === undefined
          ? CharacterStatus.draft()
          : CharacterStatus.create(command.input.status),
      race: command.input.race ?? null,
      characterClass: command.input.characterClass ?? null,
      subclass: command.input.subclass ?? null,
      level: command.input.level ?? null,
      background: command.input.background ?? null,
      alignment: command.input.alignment ?? null,
      experiencePoints: command.input.experiencePoints ?? null,
      armorClass: command.input.armorClass ?? null,
      initiativeBonus: command.input.initiativeBonus ?? null,
      speed: command.input.speed ?? null,
      maxHitPoints: command.input.maxHitPoints ?? null,
      currentHitPoints: command.input.currentHitPoints ?? null,
      temporaryHitPoints: command.input.temporaryHitPoints ?? null,
      hitDice: command.input.hitDice ?? null,
      strength: command.input.strength ?? null,
      dexterity: command.input.dexterity ?? null,
      constitution: command.input.constitution ?? null,
      intelligence: command.input.intelligence ?? null,
      wisdom: command.input.wisdom ?? null,
      charisma: command.input.charisma ?? null,
      proficiencyBonus: command.input.proficiencyBonus ?? null,
      savingThrows: command.input.savingThrows ?? null,
      skills: command.input.skills ?? null,
      proficiencies: command.input.proficiencies ?? null,
      languages: command.input.languages ?? null,
      attacksAndSpellcasting: command.input.attacksAndSpellcasting ?? null,
      spellcasting: command.input.spellcasting ?? null,
      featuresAndTraits: command.input.featuresAndTraits ?? null,
      personalityTraits: command.input.personalityTraits ?? null,
      ideals: command.input.ideals ?? null,
      bonds: command.input.bonds ?? null,
      flaws: command.input.flaws ?? null,
      backstory: command.input.backstory ?? null,
      appearance: command.input.appearance ?? null,
      customData: command.input.customData ?? null,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.characterRepository.create(character);

    return mapCharacterDetailsFromDomain(character);
  }
}
