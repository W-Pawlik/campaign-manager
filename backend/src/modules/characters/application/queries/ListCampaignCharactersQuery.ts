import type { Query } from "@core/application/cqrs/Query";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";

export interface ListCampaignCharactersInput {
  campaignId: string;
  actorUserId: string;
}

export class ListCampaignCharactersQuery implements Query<CharacterListItemDTO[]> {
  public constructor(public readonly input: ListCampaignCharactersInput) {}
}
