import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import type { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";

export interface CharacterProps {
  id: string;
  campaignId: string;
  ownerUserId: string | null;
  sheetTemplateId: string | null;
  name: string;
  avatarUrl: string | null;
  type: CharacterType;
  status: CharacterStatus;
  race: string | null;
  characterClass: string | null;
  subclass: string | null;
  level: number | null;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateCharacterParams = Omit<
  Partial<CharacterProps>,
  "id" | "campaignId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Character {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly ownerUserId: string | null;
  public readonly sheetTemplateId: string | null;
  public readonly name: string;
  public readonly avatarUrl: string | null;
  public readonly type: CharacterType;
  public readonly status: CharacterStatus;
  public readonly race: string | null;
  public readonly characterClass: string | null;
  public readonly subclass: string | null;
  public readonly level: number | null;
  public readonly background: string | null;
  public readonly alignment: string | null;
  public readonly experiencePoints: number | null;
  public readonly armorClass: number | null;
  public readonly initiativeBonus: number | null;
  public readonly speed: string | null;
  public readonly maxHitPoints: number | null;
  public readonly currentHitPoints: number | null;
  public readonly temporaryHitPoints: number | null;
  public readonly hitDice: string | null;
  public readonly strength: number | null;
  public readonly dexterity: number | null;
  public readonly constitution: number | null;
  public readonly intelligence: number | null;
  public readonly wisdom: number | null;
  public readonly charisma: number | null;
  public readonly proficiencyBonus: number | null;
  public readonly savingThrows: unknown | null;
  public readonly skills: unknown | null;
  public readonly proficiencies: unknown | null;
  public readonly languages: unknown | null;
  public readonly attacksAndSpellcasting: unknown | null;
  public readonly spellcasting: unknown | null;
  public readonly featuresAndTraits: unknown | null;
  public readonly personalityTraits: string | null;
  public readonly ideals: string | null;
  public readonly bonds: string | null;
  public readonly flaws: string | null;
  public readonly backstory: string | null;
  public readonly appearance: string | null;
  public readonly customData: unknown | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: CharacterProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.ownerUserId = props.ownerUserId;
    this.sheetTemplateId = props.sheetTemplateId;
    this.name = props.name;
    this.avatarUrl = props.avatarUrl;
    this.type = props.type;
    this.status = props.status;
    this.race = props.race;
    this.characterClass = props.characterClass;
    this.subclass = props.subclass;
    this.level = props.level;
    this.background = props.background;
    this.alignment = props.alignment;
    this.experiencePoints = props.experiencePoints;
    this.armorClass = props.armorClass;
    this.initiativeBonus = props.initiativeBonus;
    this.speed = props.speed;
    this.maxHitPoints = props.maxHitPoints;
    this.currentHitPoints = props.currentHitPoints;
    this.temporaryHitPoints = props.temporaryHitPoints;
    this.hitDice = props.hitDice;
    this.strength = props.strength;
    this.dexterity = props.dexterity;
    this.constitution = props.constitution;
    this.intelligence = props.intelligence;
    this.wisdom = props.wisdom;
    this.charisma = props.charisma;
    this.proficiencyBonus = props.proficiencyBonus;
    this.savingThrows = props.savingThrows;
    this.skills = props.skills;
    this.proficiencies = props.proficiencies;
    this.languages = props.languages;
    this.attacksAndSpellcasting = props.attacksAndSpellcasting;
    this.spellcasting = props.spellcasting;
    this.featuresAndTraits = props.featuresAndTraits;
    this.personalityTraits = props.personalityTraits;
    this.ideals = props.ideals;
    this.bonds = props.bonds;
    this.flaws = props.flaws;
    this.backstory = props.backstory;
    this.appearance = props.appearance;
    this.customData = props.customData;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: CharacterProps): Character {
    Character.validate(props);

    return new Character(props);
  }

  public withUpdates(params: UpdateCharacterParams): Character {
    this.ensureIsEditable();

    return Character.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public archive(archivedAt: Date): Character {
    this.ensureIsNotDeleted();

    if (this.status.isArchived()) {
      return this;
    }

    return Character.create({
      ...this.toProps(),
      status: CharacterStatus.archived(),
      updatedAt: archivedAt,
    });
  }

  public softDelete(deletedAt: Date): Character {
    if (this.deletedAt !== null) {
      return this;
    }

    return Character.create({
      ...this.toProps(),
      status: CharacterStatus.archived(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureIsEditable(): void {
    this.ensureIsNotDeleted();

    if (this.status.isArchived()) {
      throw new ForbiddenError("Archived character cannot be edited");
    }
  }

  public ensureIsNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted character cannot be modified");
    }
  }

  private toProps(): CharacterProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      ownerUserId: this.ownerUserId,
      sheetTemplateId: this.sheetTemplateId,
      name: this.name,
      avatarUrl: this.avatarUrl,
      type: this.type,
      status: this.status,
      race: this.race,
      characterClass: this.characterClass,
      subclass: this.subclass,
      level: this.level,
      background: this.background,
      alignment: this.alignment,
      experiencePoints: this.experiencePoints,
      armorClass: this.armorClass,
      initiativeBonus: this.initiativeBonus,
      speed: this.speed,
      maxHitPoints: this.maxHitPoints,
      currentHitPoints: this.currentHitPoints,
      temporaryHitPoints: this.temporaryHitPoints,
      hitDice: this.hitDice,
      strength: this.strength,
      dexterity: this.dexterity,
      constitution: this.constitution,
      intelligence: this.intelligence,
      wisdom: this.wisdom,
      charisma: this.charisma,
      proficiencyBonus: this.proficiencyBonus,
      savingThrows: this.savingThrows,
      skills: this.skills,
      proficiencies: this.proficiencies,
      languages: this.languages,
      attacksAndSpellcasting: this.attacksAndSpellcasting,
      spellcasting: this.spellcasting,
      featuresAndTraits: this.featuresAndTraits,
      personalityTraits: this.personalityTraits,
      ideals: this.ideals,
      bonds: this.bonds,
      flaws: this.flaws,
      backstory: this.backstory,
      appearance: this.appearance,
      customData: this.customData,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: CharacterProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 120) {
      throw new ValidationError("Character name must be between 1 and 120 characters");
    }

    if (props.type.isPlayerCharacter() && props.ownerUserId === null) {
      throw new ValidationError("Player character must have an owner");
    }
  }
}
