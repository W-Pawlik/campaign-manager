import type {
  CopyCatalogMonsterToCampaignRequestBody,
  CreatePublishedMonsterRequestBody,
} from "@api/schemas/monster-catalog.schemas";
import type { CreatePublishedMonsterInput } from "@modules/monsters/application/commands/CreatePublishedMonsterCommand";
import type { CopyPublishedMonsterToCampaignInput } from "@modules/monsters/application/commands/CopyPublishedMonsterToCampaignCommand";
import type { ImportOpen5eCreatureAsMonsterInput } from "@modules/monsters/application/commands/ImportOpen5eCreatureAsMonsterCommand";

export function mapCreatePublishedMonsterCommandInput(params: {
  actorUserId: string;
  body: CreatePublishedMonsterRequestBody;
}): CreatePublishedMonsterInput {
  const body = params.body;

  return {
    actorUserId: params.actorUserId,
    name: body.name,
    ...(body.gameSystemId === undefined ? {} : { gameSystemId: body.gameSystemId }),
    ...(body.size === undefined ? {} : { size: body.size }),
    ...(body.type === undefined ? {} : { type: body.type }),
    ...(body.subtype === undefined ? {} : { subtype: body.subtype }),
    ...(body.alignment === undefined ? {} : { alignment: body.alignment }),
    ...(body.armorClass === undefined ? {} : { armorClass: body.armorClass }),
    ...(body.armorClassDetails === undefined ? {} : { armorClassDetails: body.armorClassDetails }),
    ...(body.hitPoints === undefined ? {} : { hitPoints: body.hitPoints }),
    ...(body.hitDice === undefined ? {} : { hitDice: body.hitDice }),
    ...(body.speed === undefined ? {} : { speed: body.speed }),
    ...(body.strength === undefined ? {} : { strength: body.strength }),
    ...(body.dexterity === undefined ? {} : { dexterity: body.dexterity }),
    ...(body.constitution === undefined ? {} : { constitution: body.constitution }),
    ...(body.intelligence === undefined ? {} : { intelligence: body.intelligence }),
    ...(body.wisdom === undefined ? {} : { wisdom: body.wisdom }),
    ...(body.charisma === undefined ? {} : { charisma: body.charisma }),
    ...(body.savingThrows === undefined ? {} : { savingThrows: body.savingThrows }),
    ...(body.skills === undefined ? {} : { skills: body.skills }),
    ...(body.damageResistances === undefined ? {} : { damageResistances: body.damageResistances }),
    ...(body.damageImmunities === undefined ? {} : { damageImmunities: body.damageImmunities }),
    ...(body.conditionImmunities === undefined ? {} : { conditionImmunities: body.conditionImmunities }),
    ...(body.damageVulnerabilities === undefined ? {} : { damageVulnerabilities: body.damageVulnerabilities }),
    ...(body.senses === undefined ? {} : { senses: body.senses }),
    ...(body.languages === undefined ? {} : { languages: body.languages }),
    ...(body.challengeRating === undefined ? {} : { challengeRating: body.challengeRating }),
    ...(body.challengeRatingDecimal === undefined ? {} : { challengeRatingDecimal: body.challengeRatingDecimal }),
    ...(body.proficiencyBonus === undefined ? {} : { proficiencyBonus: body.proficiencyBonus }),
    ...(body.xp === undefined ? {} : { xp: body.xp }),
    ...(body.traits === undefined ? {} : { traits: body.traits }),
    ...(body.actions === undefined ? {} : { actions: body.actions }),
    ...(body.bonusActions === undefined ? {} : { bonusActions: body.bonusActions }),
    ...(body.reactions === undefined ? {} : { reactions: body.reactions }),
    ...(body.legendaryActions === undefined ? {} : { legendaryActions: body.legendaryActions }),
    ...(body.lairActions === undefined ? {} : { lairActions: body.lairActions }),
    ...(body.regionalEffects === undefined ? {} : { regionalEffects: body.regionalEffects }),
    ...(body.spellcasting === undefined ? {} : { spellcasting: body.spellcasting }),
    ...(body.description === undefined ? {} : { description: body.description }),
    ...(body.sourceBook === undefined ? {} : { sourceBook: body.sourceBook }),
    ...(body.pageNumber === undefined ? {} : { pageNumber: body.pageNumber }),
    ...(body.customData === undefined ? {} : { customData: body.customData }),
  };
}

export function mapCopyPublishedMonsterToCampaignCommandInput(params: {
  actorUserId: string;
  sourceMonsterId: string;
  body: CopyCatalogMonsterToCampaignRequestBody;
}): CopyPublishedMonsterToCampaignInput {
  return {
    actorUserId: params.actorUserId,
    campaignId: params.body.campaignId,
    sourceMonsterId: params.sourceMonsterId,
    ...(params.body.nameOverride === undefined
      ? {}
      : { nameOverride: params.body.nameOverride }),
  };
}

export function mapCopyOpen5eCreatureToCampaignCommandInput(params: {
  actorUserId: string;
  resourceKey: string;
  body: CopyCatalogMonsterToCampaignRequestBody;
}): ImportOpen5eCreatureAsMonsterInput {
  return {
    actorUserId: params.actorUserId,
    campaignId: params.body.campaignId,
    resourceKey: params.resourceKey,
    ...(params.body.nameOverride === undefined
      ? {}
      : { nameOverride: params.body.nameOverride }),
  };
}
