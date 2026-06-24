export type MonsterVisibility = "PUBLIC" | "GM_ONLY";
export type MonsterStatus = "ACTIVE" | "ARCHIVED";
export type MonsterSize =
  | "TINY"
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "HUGE"
  | "GARGANTUAN"
  | "UNKNOWN";

export type CampaignMonsterListItem = {
  id: string;
  campaignId: string | null;
  name: string;
  slug: string;
  source: string;
  size: string | null;
  type: string | null;
  armorClass: number | null;
  hitPoints: number | null;
  challengeRating: string | null;
  challengeRatingDecimal: number | null;
  visibility: string;
  status: string;
};

export type CampaignMonsterDetails = {
  id: string;
  campaignId: string | null;
  name: string;
  slug: string;
  source: string;
  externalReferenceId: string | null;
  size: string | null;
  type: string | null;
  subtype: string | null;
  alignment: string | null;
  armorClass: number | null;
  armorClassDetails: string | null;
  hitPoints: number | null;
  hitDice: string | null;
  speed: unknown | null;
  abilities: {
    strength: number | null;
    dexterity: number | null;
    constitution: number | null;
    intelligence: number | null;
    wisdom: number | null;
    charisma: number | null;
  };
  savingThrows: unknown | null;
  skills: unknown | null;
  damageResistances: unknown | null;
  damageImmunities: unknown | null;
  conditionImmunities: unknown | null;
  damageVulnerabilities: unknown | null;
  senses: string | null;
  languages: string | null;
  challengeRating: string | null;
  challengeRatingDecimal: number | null;
  proficiencyBonus: number | null;
  xp: number | null;
  traits: unknown | null;
  actions: unknown | null;
  bonusActions: unknown | null;
  reactions: unknown | null;
  legendaryActions: unknown | null;
  lairActions: unknown | null;
  regionalEffects: unknown | null;
  spellcasting: unknown | null;
  description: string | null;
  sourceBook: string | null;
  pageNumber: string | null;
  visibility: string;
  status: string;
  customData: unknown | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMonsterPayload = {
  name: string;
  size?: MonsterSize | null;
  type?: string | null;
  subtype?: string | null;
  alignment?: string | null;
  armorClass?: number | null;
  armorClassDetails?: string | null;
  hitPoints?: number | null;
  hitDice?: string | null;
  challengeRating?: string | null;
  challengeRatingDecimal?: number | null;
  description?: string | null;
  visibility?: MonsterVisibility;
};

export type UpdateMonsterPayload = Partial<CreateMonsterPayload>;

export type ImportOpen5eMonsterPayload = {
  externalReferenceId?: string;
  nameOverride?: string;
  resourceKey?: string;
};

export type Open5eSearchResult = {
  provider: string;
  resourceType: string;
  key: string;
  name: string;
  summary?: string | null;
  highlighted?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
};

export type Open5eResourceDetails = {
  id: string;
  provider: string;
  resourceType: string;
  key: string | null;
  slug: string | null;
  url: string | null;
  name: string;
  sourceDocumentKey: string | null;
  sourceDocumentName: string | null;
  normalizedData?: unknown;
  cachedAt: string;
  expiresAt: string | null;
};

export const monsterVisibilityOptions: MonsterVisibility[] = ["GM_ONLY", "PUBLIC"];
export const monsterSizeOptions: MonsterSize[] = [
  "TINY",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "HUGE",
  "GARGANTUAN",
  "UNKNOWN",
];
