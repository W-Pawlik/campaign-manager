import type { Character } from "@modules/characters/domain/entities/Character";

export interface CharacterRepository {
  findById(campaignId: string, characterId: string): Promise<Character | null>;
  create(character: Character): Promise<void>;
  save(character: Character): Promise<void>;
}
