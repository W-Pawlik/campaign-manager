import type { CampaignCharacterListItem } from "@/features/campaigns";

export type CharacterType = "PLAYER_CHARACTER" | "COMPANION" | "TEMPORARY";
export type CharacterStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "DEAD"
  | "RETIRED"
  | "ARCHIVED";

export type CampaignCharacterDetails = CampaignCharacterListItem & {
  sheetTemplateId: string | null;
  subclass: string | null;
  background: string | null;
  alignment: string | null;
  experiencePoints: number | null;
  armorClass: number | null;
  initiativeBonus: number | null;
  speed: string | null;
  maxHitPoints: number | null;
  currentHitPoints: number | null;
  temporaryHitPoints: number | null;
  hitDice: string | null;
  strength: number | null;
  dexterity: number | null;
  constitution: number | null;
  intelligence: number | null;
  wisdom: number | null;
  charisma: number | null;
  proficiencyBonus: number | null;
  savingThrows: unknown | null;
  skills: unknown | null;
  proficiencies: unknown | null;
  languages: unknown | null;
  attacksAndSpellcasting: unknown | null;
  spellcasting: unknown | null;
  featuresAndTraits: unknown | null;
  personalityTraits: string | null;
  ideals: string | null;
  bonds: string | null;
  flaws: string | null;
  backstory: string | null;
  appearance: string | null;
  customData: unknown | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateCharacterPayload = {
  ownerUserId?: string | null;
  name: string;
  avatarUrl?: string | null;
  type?: CharacterType;
  status?: CharacterStatus;
  race?: string | null;
  characterClass?: string | null;
  subclass?: string | null;
  level?: number | null;
  background?: string | null;
  alignment?: string | null;
  armorClass?: number | null;
  maxHitPoints?: number | null;
  currentHitPoints?: number | null;
  strength?: number | null;
  dexterity?: number | null;
  constitution?: number | null;
  intelligence?: number | null;
  wisdom?: number | null;
  charisma?: number | null;
  backstory?: string | null;
  appearance?: string | null;
  personalityTraits?: string | null;
  ideals?: string | null;
  bonds?: string | null;
  flaws?: string | null;
};

export type UpdateCharacterPayload = Partial<CreateCharacterPayload>;

export const characterTypeOptions: CharacterType[] = [
  "PLAYER_CHARACTER",
  "COMPANION",
  "TEMPORARY",
];

export const characterStatusOptions: CharacterStatus[] = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "DEAD",
  "RETIRED",
  "ARCHIVED",
];
