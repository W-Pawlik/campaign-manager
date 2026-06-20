import type { Query } from "@core/application/cqrs/Query";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";

export interface GetCharacterDetailsInput {
  campaignId: string;
  characterId: string;
  actorUserId: string;
}

export class GetCharacterDetailsQuery implements Query<CharacterDetailsDTO> {
  public constructor(public readonly input: GetCharacterDetailsInput) {}
}
