import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";

export interface CharacterReadRepository {
  listCampaignCharacters(campaignId: string): Promise<CharacterListItemDTO[]>;
  getCharacterDetails(campaignId: string, characterId: string): Promise<CharacterDetailsDTO | null>;
}
