import type { Command } from "@core/application/cqrs/Command";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";

export interface CreateCharacterInput {
  campaignId: string;
  actorUserId: string;
  ownerUserId?: string | null;
  sheetTemplateId?: string | null;
  name: string;
  avatarUrl?: string | null;
  type?: string;
  status?: string;
  race?: string | null;
  characterClass?: string | null;
  subclass?: string | null;
  level?: number | null;
  background?: string | null;
  alignment?: string | null;
  experiencePoints?: number | null;
  armorClass?: number | null;
  initiativeBonus?: number | null;
  speed?: string | null;
  maxHitPoints?: number | null;
  currentHitPoints?: number | null;
  temporaryHitPoints?: number | null;
  hitDice?: string | null;
  strength?: number | null;
  dexterity?: number | null;
  constitution?: number | null;
  intelligence?: number | null;
  wisdom?: number | null;
  charisma?: number | null;
  proficiencyBonus?: number | null;
  savingThrows?: unknown | null;
  skills?: unknown | null;
  proficiencies?: unknown | null;
  languages?: unknown | null;
  attacksAndSpellcasting?: unknown | null;
  spellcasting?: unknown | null;
  featuresAndTraits?: unknown | null;
  personalityTraits?: string | null;
  ideals?: string | null;
  bonds?: string | null;
  flaws?: string | null;
  backstory?: string | null;
  appearance?: string | null;
  customData?: unknown | null;
}

export class CreateCharacterCommand implements Command<CharacterDetailsDTO> {
  public constructor(public readonly input: CreateCharacterInput) {}
}
