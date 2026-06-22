import type { Command } from "@core/application/cqrs/Command";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface UpdateMonsterInput {
  campaignId: string;
  monsterId: string;
  actorUserId: string;
  name?: string;
  size?: string | null;
  type?: string | null;
  subtype?: string | null;
  alignment?: string | null;
  armorClass?: number | null;
  armorClassDetails?: string | null;
  hitPoints?: number | null;
  hitDice?: string | null;
  speed?: unknown | null;
  strength?: number | null;
  dexterity?: number | null;
  constitution?: number | null;
  intelligence?: number | null;
  wisdom?: number | null;
  charisma?: number | null;
  savingThrows?: unknown | null;
  skills?: unknown | null;
  damageResistances?: unknown | null;
  damageImmunities?: unknown | null;
  conditionImmunities?: unknown | null;
  damageVulnerabilities?: unknown | null;
  senses?: string | null;
  languages?: string | null;
  challengeRating?: string | null;
  challengeRatingDecimal?: number | null;
  proficiencyBonus?: number | null;
  xp?: number | null;
  traits?: unknown | null;
  actions?: unknown | null;
  bonusActions?: unknown | null;
  reactions?: unknown | null;
  legendaryActions?: unknown | null;
  lairActions?: unknown | null;
  regionalEffects?: unknown | null;
  spellcasting?: unknown | null;
  description?: string | null;
  sourceBook?: string | null;
  pageNumber?: string | null;
  visibility?: string;
  customData?: unknown | null;
}

export class UpdateMonsterCommand implements Command<MonsterDetailsDTO> {
  public constructor(public readonly input: UpdateMonsterInput) {}
}
