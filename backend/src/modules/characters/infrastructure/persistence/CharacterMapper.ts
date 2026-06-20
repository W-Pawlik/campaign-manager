import { Prisma, type Character as PrismaCharacter } from "@prisma/client";
import { Character } from "@modules/characters/domain/entities/Character";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";

export class CharacterMapper {
  public toDomain(prismaCharacter: PrismaCharacter): Character {
    return Character.create({
      id: prismaCharacter.id,
      campaignId: prismaCharacter.campaignId,
      ownerUserId: prismaCharacter.ownerUserId,
      sheetTemplateId: prismaCharacter.sheetTemplateId,
      name: prismaCharacter.name,
      avatarUrl: prismaCharacter.avatarUrl,
      type: CharacterType.create(prismaCharacter.type),
      status: CharacterStatus.create(prismaCharacter.status),
      race: prismaCharacter.race,
      characterClass: prismaCharacter.characterClass,
      subclass: prismaCharacter.subclass,
      level: prismaCharacter.level,
      background: prismaCharacter.background,
      alignment: prismaCharacter.alignment,
      experiencePoints: prismaCharacter.experiencePoints,
      armorClass: prismaCharacter.armorClass,
      initiativeBonus: prismaCharacter.initiativeBonus,
      speed: prismaCharacter.speed,
      maxHitPoints: prismaCharacter.maxHitPoints,
      currentHitPoints: prismaCharacter.currentHitPoints,
      temporaryHitPoints: prismaCharacter.temporaryHitPoints,
      hitDice: prismaCharacter.hitDice,
      strength: prismaCharacter.strength,
      dexterity: prismaCharacter.dexterity,
      constitution: prismaCharacter.constitution,
      intelligence: prismaCharacter.intelligence,
      wisdom: prismaCharacter.wisdom,
      charisma: prismaCharacter.charisma,
      proficiencyBonus: prismaCharacter.proficiencyBonus,
      savingThrows: prismaCharacter.savingThrows,
      skills: prismaCharacter.skills,
      proficiencies: prismaCharacter.proficiencies,
      languages: prismaCharacter.languages,
      attacksAndSpellcasting: prismaCharacter.attacksAndSpellcasting,
      spellcasting: prismaCharacter.spellcasting,
      featuresAndTraits: prismaCharacter.featuresAndTraits,
      personalityTraits: prismaCharacter.personalityTraits,
      ideals: prismaCharacter.ideals,
      bonds: prismaCharacter.bonds,
      flaws: prismaCharacter.flaws,
      backstory: prismaCharacter.backstory,
      appearance: prismaCharacter.appearance,
      customData: prismaCharacter.customData,
      createdAt: prismaCharacter.createdAt,
      updatedAt: prismaCharacter.updatedAt,
      deletedAt: prismaCharacter.deletedAt,
    });
  }

  public toPersistenceCreate(character: Character): Prisma.CharacterUncheckedCreateInput {
    return {
      id: character.id,
      campaignId: character.campaignId,
      ownerUserId: character.ownerUserId,
      sheetTemplateId: character.sheetTemplateId,
      name: character.name,
      avatarUrl: character.avatarUrl,
      type: character.type.value,
      status: character.status.value,
      race: character.race,
      characterClass: character.characterClass,
      subclass: character.subclass,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      experiencePoints: character.experiencePoints,
      armorClass: character.armorClass,
      initiativeBonus: character.initiativeBonus,
      speed: character.speed,
      maxHitPoints: character.maxHitPoints,
      currentHitPoints: character.currentHitPoints,
      temporaryHitPoints: character.temporaryHitPoints,
      hitDice: character.hitDice,
      strength: character.strength,
      dexterity: character.dexterity,
      constitution: character.constitution,
      intelligence: character.intelligence,
      wisdom: character.wisdom,
      charisma: character.charisma,
      proficiencyBonus: character.proficiencyBonus,
      savingThrows: this.toJsonValue(character.savingThrows),
      skills: this.toJsonValue(character.skills),
      proficiencies: this.toJsonValue(character.proficiencies),
      languages: this.toJsonValue(character.languages),
      attacksAndSpellcasting: this.toJsonValue(character.attacksAndSpellcasting),
      spellcasting: this.toJsonValue(character.spellcasting),
      featuresAndTraits: this.toJsonValue(character.featuresAndTraits),
      personalityTraits: character.personalityTraits,
      ideals: character.ideals,
      bonds: character.bonds,
      flaws: character.flaws,
      backstory: character.backstory,
      appearance: character.appearance,
      customData: this.toJsonValue(character.customData),
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
      deletedAt: character.deletedAt,
    };
  }

  public toPersistenceUpdate(character: Character): Prisma.CharacterUncheckedUpdateInput {
    return this.toPersistenceCreate(character);
  }

  private toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
