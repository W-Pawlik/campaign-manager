export const CHARACTERS_TYPES = {
  CharacterRepository: Symbol.for("characters.CharacterRepository"),
  CharacterReadRepository: Symbol.for("characters.CharacterReadRepository"),
  CharacterMapper: Symbol.for("characters.CharacterMapper"),
  CharacterPermissionDomainService: Symbol.for("characters.CharacterPermissionDomainService"),
  CreateCharacterHandler: Symbol.for("characters.CreateCharacterHandler"),
  UpdateCharacterHandler: Symbol.for("characters.UpdateCharacterHandler"),
  ArchiveCharacterHandler: Symbol.for("characters.ArchiveCharacterHandler"),
  DeleteCharacterHandler: Symbol.for("characters.DeleteCharacterHandler"),
  ListCampaignCharactersHandler: Symbol.for("characters.ListCampaignCharactersHandler"),
  GetCharacterDetailsHandler: Symbol.for("characters.GetCharacterDetailsHandler"),
} as const;
