import type { PrismaClient } from "@prisma/client";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";

export class PrismaCharacterReadRepository implements CharacterReadRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async listCampaignCharacters(campaignId: string): Promise<CharacterListItemDTO[]> {
    const characters = await this.prismaClient.character.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        { name: "asc" },
        { createdAt: "asc" },
      ],
    });

    return characters.map((character) => ({
      id: character.id,
      campaignId: character.campaignId,
      ownerUserId: character.ownerUserId,
      ownerUsername: character.owner?.username ?? null,
      name: character.name,
      avatarUrl: character.avatarUrl,
      type: character.type,
      status: character.status,
      race: character.race,
      characterClass: character.characterClass,
      level: character.level,
      updatedAt: character.updatedAt.toISOString(),
    }));
  }

  public async getCharacterDetails(
    campaignId: string,
    characterId: string,
  ): Promise<CharacterDetailsDTO | null> {
    const character = await this.prismaClient.character.findFirst({
      where: {
        id: characterId,
        campaignId,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    if (character === null) {
      return null;
    }

    return {
      id: character.id,
      campaignId: character.campaignId,
      ownerUserId: character.ownerUserId,
      ownerUsername: character.owner?.username ?? null,
      sheetTemplateId: character.sheetTemplateId,
      name: character.name,
      avatarUrl: character.avatarUrl,
      type: character.type,
      status: character.status,
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
      savingThrows: character.savingThrows,
      skills: character.skills,
      proficiencies: character.proficiencies,
      languages: character.languages,
      attacksAndSpellcasting: character.attacksAndSpellcasting,
      spellcasting: character.spellcasting,
      featuresAndTraits: character.featuresAndTraits,
      personalityTraits: character.personalityTraits,
      ideals: character.ideals,
      bonds: character.bonds,
      flaws: character.flaws,
      backstory: character.backstory,
      appearance: character.appearance,
      customData: character.customData,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
      deletedAt: character.deletedAt?.toISOString() ?? null,
    };
  }
}
