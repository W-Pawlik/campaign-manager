export const MONSTERS_TYPES = {
  MonsterMapper: Symbol.for("monsters.MonsterMapper"),
  MonsterRepository: Symbol.for("monsters.MonsterRepository"),
  MonsterReadRepository: Symbol.for("monsters.MonsterReadRepository"),
  MonsterVisibilityApplicationService: Symbol.for("monsters.MonsterVisibilityApplicationService"),
  CreateCustomMonsterHandler: Symbol.for("monsters.CreateCustomMonsterHandler"),
  UpdateMonsterHandler: Symbol.for("monsters.UpdateMonsterHandler"),
  ArchiveMonsterHandler: Symbol.for("monsters.ArchiveMonsterHandler"),
  CopyMonsterToCampaignHandler: Symbol.for("monsters.CopyMonsterToCampaignHandler"),
  ListCampaignMonstersHandler: Symbol.for("monsters.ListCampaignMonstersHandler"),
  GetMonsterDetailsHandler: Symbol.for("monsters.GetMonsterDetailsHandler"),
} as const;
