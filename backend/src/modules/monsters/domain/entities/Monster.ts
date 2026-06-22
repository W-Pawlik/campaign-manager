import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { MonsterSize } from "@modules/monsters/domain/value-objects/MonsterSize";
import type { MonsterSource } from "@modules/monsters/domain/value-objects/MonsterSource";
import { MonsterStatus } from "@modules/monsters/domain/value-objects/MonsterStatus";
import type { MonsterVisibility } from "@modules/monsters/domain/value-objects/MonsterVisibility";

export interface MonsterProps {
  id: string;
  campaignId: string | null;
  gameSystemId: string | null;
  source: MonsterSource;
  externalReferenceId: string | null;
  name: string;
  slug: string;
  size: MonsterSize | null;
  type: string | null;
  subtype: string | null;
  alignment: string | null;
  armorClass: number | null;
  armorClassDetails: string | null;
  hitPoints: number | null;
  hitDice: string | null;
  speed: unknown | null;
  strength: number | null;
  dexterity: number | null;
  constitution: number | null;
  intelligence: number | null;
  wisdom: number | null;
  charisma: number | null;
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
  visibility: MonsterVisibility;
  status: MonsterStatus;
  rawData: unknown | null;
  customData: unknown | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateMonsterParams = Omit<
  Partial<MonsterProps>,
  "id" | "campaignId" | "gameSystemId" | "source" | "externalReferenceId" | "createdById" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Monster {
  public readonly id: string;
  public readonly campaignId: string | null;
  public readonly gameSystemId: string | null;
  public readonly source: MonsterSource;
  public readonly externalReferenceId: string | null;
  public readonly name: string;
  public readonly slug: string;
  public readonly size: MonsterSize | null;
  public readonly type: string | null;
  public readonly subtype: string | null;
  public readonly alignment: string | null;
  public readonly armorClass: number | null;
  public readonly armorClassDetails: string | null;
  public readonly hitPoints: number | null;
  public readonly hitDice: string | null;
  public readonly speed: unknown | null;
  public readonly strength: number | null;
  public readonly dexterity: number | null;
  public readonly constitution: number | null;
  public readonly intelligence: number | null;
  public readonly wisdom: number | null;
  public readonly charisma: number | null;
  public readonly savingThrows: unknown | null;
  public readonly skills: unknown | null;
  public readonly damageResistances: unknown | null;
  public readonly damageImmunities: unknown | null;
  public readonly conditionImmunities: unknown | null;
  public readonly damageVulnerabilities: unknown | null;
  public readonly senses: string | null;
  public readonly languages: string | null;
  public readonly challengeRating: string | null;
  public readonly challengeRatingDecimal: number | null;
  public readonly proficiencyBonus: number | null;
  public readonly xp: number | null;
  public readonly traits: unknown | null;
  public readonly actions: unknown | null;
  public readonly bonusActions: unknown | null;
  public readonly reactions: unknown | null;
  public readonly legendaryActions: unknown | null;
  public readonly lairActions: unknown | null;
  public readonly regionalEffects: unknown | null;
  public readonly spellcasting: unknown | null;
  public readonly description: string | null;
  public readonly sourceBook: string | null;
  public readonly pageNumber: string | null;
  public readonly visibility: MonsterVisibility;
  public readonly status: MonsterStatus;
  public readonly rawData: unknown | null;
  public readonly customData: unknown | null;
  public readonly createdById: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: MonsterProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.gameSystemId = props.gameSystemId;
    this.source = props.source;
    this.externalReferenceId = props.externalReferenceId;
    this.name = props.name;
    this.slug = props.slug;
    this.size = props.size;
    this.type = props.type;
    this.subtype = props.subtype;
    this.alignment = props.alignment;
    this.armorClass = props.armorClass;
    this.armorClassDetails = props.armorClassDetails;
    this.hitPoints = props.hitPoints;
    this.hitDice = props.hitDice;
    this.speed = props.speed;
    this.strength = props.strength;
    this.dexterity = props.dexterity;
    this.constitution = props.constitution;
    this.intelligence = props.intelligence;
    this.wisdom = props.wisdom;
    this.charisma = props.charisma;
    this.savingThrows = props.savingThrows;
    this.skills = props.skills;
    this.damageResistances = props.damageResistances;
    this.damageImmunities = props.damageImmunities;
    this.conditionImmunities = props.conditionImmunities;
    this.damageVulnerabilities = props.damageVulnerabilities;
    this.senses = props.senses;
    this.languages = props.languages;
    this.challengeRating = props.challengeRating;
    this.challengeRatingDecimal = props.challengeRatingDecimal;
    this.proficiencyBonus = props.proficiencyBonus;
    this.xp = props.xp;
    this.traits = props.traits;
    this.actions = props.actions;
    this.bonusActions = props.bonusActions;
    this.reactions = props.reactions;
    this.legendaryActions = props.legendaryActions;
    this.lairActions = props.lairActions;
    this.regionalEffects = props.regionalEffects;
    this.spellcasting = props.spellcasting;
    this.description = props.description;
    this.sourceBook = props.sourceBook;
    this.pageNumber = props.pageNumber;
    this.visibility = props.visibility;
    this.status = props.status;
    this.rawData = props.rawData;
    this.customData = props.customData;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: MonsterProps): Monster {
    Monster.validate(props);

    return new Monster(props);
  }

  public withUpdates(params: UpdateMonsterParams): Monster {
    this.ensureEditable();

    return Monster.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public archive(archivedAt: Date): Monster {
    this.ensureNotDeleted();

    if (this.status.isArchived()) {
      return this;
    }

    return Monster.create({
      ...this.toProps(),
      status: MonsterStatus.archived(),
      updatedAt: archivedAt,
      deletedAt: archivedAt,
    });
  }

  public copyToCampaign(params: {
    id: string;
    campaignId: string;
    slug: string;
    name?: string;
    actorUserId: string;
    copiedAt: Date;
  }): Monster {
    return Monster.create({
      ...this.toProps(),
      id: params.id,
      campaignId: params.campaignId,
      source: this.source,
      name: params.name?.trim() ?? this.name,
      slug: params.slug,
      visibility: this.visibility,
      status: this.status,
      createdById: params.actorUserId,
      createdAt: params.copiedAt,
      updatedAt: params.copiedAt,
      deletedAt: null,
    });
  }

  public ensureEditable(): void {
    this.ensureNotDeleted();

    if (this.status.isArchived()) {
      throw new ForbiddenError("Archived monster cannot be edited");
    }
  }

  public ensureNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted monster cannot be modified");
    }
  }

  public isGlobal(): boolean {
    return this.campaignId === null;
  }

  private toProps(): MonsterProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      gameSystemId: this.gameSystemId,
      source: this.source,
      externalReferenceId: this.externalReferenceId,
      name: this.name,
      slug: this.slug,
      size: this.size,
      type: this.type,
      subtype: this.subtype,
      alignment: this.alignment,
      armorClass: this.armorClass,
      armorClassDetails: this.armorClassDetails,
      hitPoints: this.hitPoints,
      hitDice: this.hitDice,
      speed: this.speed,
      strength: this.strength,
      dexterity: this.dexterity,
      constitution: this.constitution,
      intelligence: this.intelligence,
      wisdom: this.wisdom,
      charisma: this.charisma,
      savingThrows: this.savingThrows,
      skills: this.skills,
      damageResistances: this.damageResistances,
      damageImmunities: this.damageImmunities,
      conditionImmunities: this.conditionImmunities,
      damageVulnerabilities: this.damageVulnerabilities,
      senses: this.senses,
      languages: this.languages,
      challengeRating: this.challengeRating,
      challengeRatingDecimal: this.challengeRatingDecimal,
      proficiencyBonus: this.proficiencyBonus,
      xp: this.xp,
      traits: this.traits,
      actions: this.actions,
      bonusActions: this.bonusActions,
      reactions: this.reactions,
      legendaryActions: this.legendaryActions,
      lairActions: this.lairActions,
      regionalEffects: this.regionalEffects,
      spellcasting: this.spellcasting,
      description: this.description,
      sourceBook: this.sourceBook,
      pageNumber: this.pageNumber,
      visibility: this.visibility,
      status: this.status,
      rawData: this.rawData,
      customData: this.customData,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: MonsterProps): void {
    const trimmedName = props.name.trim();
    const trimmedSlug = props.slug.trim();

    if (trimmedName.length < 1 || trimmedName.length > 200) {
      throw new ValidationError("Monster name must be between 1 and 200 characters");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      throw new ValidationError("Monster slug must contain only lowercase letters, digits and hyphens");
    }

    for (const abilityScore of [
      props.strength,
      props.dexterity,
      props.constitution,
      props.intelligence,
      props.wisdom,
      props.charisma,
    ]) {
      if (abilityScore !== null && (!Number.isInteger(abilityScore) || abilityScore < 1 || abilityScore > 30)) {
        throw new ValidationError("Monster ability scores must be integers between 1 and 30");
      }
    }

    if (props.armorClass !== null && (!Number.isInteger(props.armorClass) || props.armorClass <= 0)) {
      throw new ValidationError("Monster armor class must be a positive integer");
    }

    if (props.hitPoints !== null && (!Number.isInteger(props.hitPoints) || props.hitPoints < 0)) {
      throw new ValidationError("Monster hit points must be a non-negative integer");
    }

    if (props.challengeRatingDecimal !== null && props.challengeRatingDecimal < 0) {
      throw new ValidationError("Monster challenge rating decimal must be non-negative");
    }

    if (props.proficiencyBonus !== null && (!Number.isInteger(props.proficiencyBonus) || props.proficiencyBonus < 0)) {
      throw new ValidationError("Monster proficiency bonus must be a non-negative integer");
    }

    if (props.xp !== null && (!Number.isInteger(props.xp) || props.xp < 0)) {
      throw new ValidationError("Monster XP must be a non-negative integer");
    }
  }
}
