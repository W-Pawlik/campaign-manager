import { Prisma } from "@prisma/client";
import { Monster } from "@modules/monsters/domain/entities/Monster";
import { MonsterSize } from "@modules/monsters/domain/value-objects/MonsterSize";
import { MonsterSource } from "@modules/monsters/domain/value-objects/MonsterSource";
import { MonsterStatus } from "@modules/monsters/domain/value-objects/MonsterStatus";
import { MonsterVisibility } from "@modules/monsters/domain/value-objects/MonsterVisibility";

export interface MonsterPersistenceRecord {
  id: string;
  campaignId: string | null;
  gameSystemId: string | null;
  source: string;
  externalReferenceId: string | null;
  name: string;
  slug: string;
  size: string | null;
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
  visibility: string;
  status: string;
  rawData: unknown | null;
  customData: unknown | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class MonsterMapper {
  public toDomain(record: MonsterPersistenceRecord): Monster {
    return Monster.create({
      id: record.id,
      campaignId: record.campaignId,
      gameSystemId: record.gameSystemId,
      source: MonsterSource.create(record.source),
      externalReferenceId: record.externalReferenceId,
      name: record.name,
      slug: record.slug,
      size: record.size === null ? null : MonsterSize.create(record.size),
      type: record.type,
      subtype: record.subtype,
      alignment: record.alignment,
      armorClass: record.armorClass,
      armorClassDetails: record.armorClassDetails,
      hitPoints: record.hitPoints,
      hitDice: record.hitDice,
      speed: record.speed,
      strength: record.strength,
      dexterity: record.dexterity,
      constitution: record.constitution,
      intelligence: record.intelligence,
      wisdom: record.wisdom,
      charisma: record.charisma,
      savingThrows: record.savingThrows,
      skills: record.skills,
      damageResistances: record.damageResistances,
      damageImmunities: record.damageImmunities,
      conditionImmunities: record.conditionImmunities,
      damageVulnerabilities: record.damageVulnerabilities,
      senses: record.senses,
      languages: record.languages,
      challengeRating: record.challengeRating,
      challengeRatingDecimal: record.challengeRatingDecimal,
      proficiencyBonus: record.proficiencyBonus,
      xp: record.xp,
      traits: record.traits,
      actions: record.actions,
      bonusActions: record.bonusActions,
      reactions: record.reactions,
      legendaryActions: record.legendaryActions,
      lairActions: record.lairActions,
      regionalEffects: record.regionalEffects,
      spellcasting: record.spellcasting,
      description: record.description,
      sourceBook: record.sourceBook,
      pageNumber: record.pageNumber,
      visibility: MonsterVisibility.create(record.visibility),
      status: MonsterStatus.create(record.status),
      rawData: record.rawData,
      customData: record.customData,
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    });
  }

  public toPersistenceCreate(monster: Monster): Record<string, unknown> {
    return {
      id: monster.id,
      campaignId: monster.campaignId,
      gameSystemId: monster.gameSystemId,
      source: monster.source.value,
      externalReferenceId: monster.externalReferenceId,
      name: monster.name,
      slug: monster.slug,
      size: monster.size?.value ?? null,
      type: monster.type,
      subtype: monster.subtype,
      alignment: monster.alignment,
      armorClass: monster.armorClass,
      armorClassDetails: monster.armorClassDetails,
      hitPoints: monster.hitPoints,
      hitDice: monster.hitDice,
      speed: this.toJsonValue(monster.speed),
      strength: monster.strength,
      dexterity: monster.dexterity,
      constitution: monster.constitution,
      intelligence: monster.intelligence,
      wisdom: monster.wisdom,
      charisma: monster.charisma,
      savingThrows: this.toJsonValue(monster.savingThrows),
      skills: this.toJsonValue(monster.skills),
      damageResistances: this.toJsonValue(monster.damageResistances),
      damageImmunities: this.toJsonValue(monster.damageImmunities),
      conditionImmunities: this.toJsonValue(monster.conditionImmunities),
      damageVulnerabilities: this.toJsonValue(monster.damageVulnerabilities),
      senses: monster.senses,
      languages: monster.languages,
      challengeRating: monster.challengeRating,
      challengeRatingDecimal: monster.challengeRatingDecimal,
      proficiencyBonus: monster.proficiencyBonus,
      xp: monster.xp,
      traits: this.toJsonValue(monster.traits),
      actions: this.toJsonValue(monster.actions),
      bonusActions: this.toJsonValue(monster.bonusActions),
      reactions: this.toJsonValue(monster.reactions),
      legendaryActions: this.toJsonValue(monster.legendaryActions),
      lairActions: this.toJsonValue(monster.lairActions),
      regionalEffects: this.toJsonValue(monster.regionalEffects),
      spellcasting: this.toJsonValue(monster.spellcasting),
      description: monster.description,
      sourceBook: monster.sourceBook,
      pageNumber: monster.pageNumber,
      visibility: monster.visibility.value,
      status: monster.status.value,
      rawData: this.toJsonValue(monster.rawData),
      customData: this.toJsonValue(monster.customData),
      createdById: monster.createdById,
      createdAt: monster.createdAt,
      updatedAt: monster.updatedAt,
      deletedAt: monster.deletedAt,
    };
  }

  public toPersistenceUpdate(monster: Monster): Record<string, unknown> {
    return this.toPersistenceCreate(monster);
  }

  private toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
