export const MONSTERS_TYPES = {
  MonsterMapper: Symbol.for("monsters.MonsterMapper"),
  MonsterRepository: Symbol.for("monsters.MonsterRepository"),
  MonsterReadRepository: Symbol.for("monsters.MonsterReadRepository"),
  MonsterVisibilityApplicationService: Symbol.for("monsters.MonsterVisibilityApplicationService"),
  CreateCustomMonsterHandler: Symbol.for("monsters.CreateCustomMonsterHandler"),
  CreatePublishedMonsterHandler: Symbol.for("monsters.CreatePublishedMonsterHandler"),
  UpdateMonsterHandler: Symbol.for("monsters.UpdateMonsterHandler"),
  ArchiveMonsterHandler: Symbol.for("monsters.ArchiveMonsterHandler"),
  CopyMonsterToCampaignHandler: Symbol.for("monsters.CopyMonsterToCampaignHandler"),
  CopyPublishedMonsterToCampaignHandler: Symbol.for(
    "monsters.CopyPublishedMonsterToCampaignHandler",
  ),
  ImportOpen5eCreatureAsMonsterHandler: Symbol.for(
    "monsters.ImportOpen5eCreatureAsMonsterHandler",
  ),
  ListCampaignMonstersHandler: Symbol.for("monsters.ListCampaignMonstersHandler"),
  ListPublishedMonstersHandler: Symbol.for("monsters.ListPublishedMonstersHandler"),
  GetMonsterDetailsHandler: Symbol.for("monsters.GetMonsterDetailsHandler"),
  GetPublishedMonsterDetailsHandler: Symbol.for(
    "monsters.GetPublishedMonsterDetailsHandler",
  ),
} as const;
