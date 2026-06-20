import type { PrismaClient } from "@prisma/client";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { Character } from "@modules/characters/domain/entities/Character";
import type { CharacterMapper } from "@modules/characters/infrastructure/persistence/CharacterMapper";

export class PrismaCharacterRepository implements CharacterRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: CharacterMapper,
  ) {}

  public async findById(campaignId: string, characterId: string): Promise<Character | null> {
    const character = await this.prismaClient.character.findFirst({
      where: {
        id: characterId,
        campaignId,
        deletedAt: null,
      },
    });

    return character === null ? null : this.mapper.toDomain(character);
  }

  public async create(character: Character): Promise<void> {
    await this.prismaClient.character.create({
      data: this.mapper.toPersistenceCreate(character),
    });
  }

  public async save(character: Character): Promise<void> {
    await this.prismaClient.character.update({
      where: { id: character.id },
      data: this.mapper.toPersistenceUpdate(character),
    });
  }
}
