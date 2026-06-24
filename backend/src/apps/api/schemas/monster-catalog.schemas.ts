import { z } from "zod";

const monsterSizeSchema = z.enum(["TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", "GARGANTUAN", "UNKNOWN"]);

const nullableLongTextSchema = z.string().trim().min(1).max(10000).nullable();
const nullableJsonSchema = z.unknown().nullable();
const nullableUuidSchema = z.uuid().nullable();
const optionalAbilityScoreSchema = z.number().int().min(1).max(30).nullable().optional();

const createPublishedMonsterSchemaShape = {
  gameSystemId: nullableUuidSchema.optional(),
  name: z.string().trim().min(1).max(200),
  size: monsterSizeSchema.nullable().optional(),
  type: z.string().trim().min(1).max(120).nullable().optional(),
  subtype: z.string().trim().min(1).max(120).nullable().optional(),
  alignment: z.string().trim().min(1).max(120).nullable().optional(),
  armorClass: z.number().int().min(1).max(99).nullable().optional(),
  armorClassDetails: z.string().trim().min(1).max(255).nullable().optional(),
  hitPoints: z.number().int().min(0).max(9999).nullable().optional(),
  hitDice: z.string().trim().min(1).max(120).nullable().optional(),
  speed: nullableJsonSchema.optional(),
  strength: optionalAbilityScoreSchema,
  dexterity: optionalAbilityScoreSchema,
  constitution: optionalAbilityScoreSchema,
  intelligence: optionalAbilityScoreSchema,
  wisdom: optionalAbilityScoreSchema,
  charisma: optionalAbilityScoreSchema,
  savingThrows: nullableJsonSchema.optional(),
  skills: nullableJsonSchema.optional(),
  damageResistances: nullableJsonSchema.optional(),
  damageImmunities: nullableJsonSchema.optional(),
  conditionImmunities: nullableJsonSchema.optional(),
  damageVulnerabilities: nullableJsonSchema.optional(),
  senses: z.string().trim().min(1).max(255).nullable().optional(),
  languages: z.string().trim().min(1).max(255).nullable().optional(),
  challengeRating: z.string().trim().min(1).max(32).nullable().optional(),
  challengeRatingDecimal: z.number().min(0).max(100).nullable().optional(),
  proficiencyBonus: z.number().int().min(0).max(20).nullable().optional(),
  xp: z.number().int().min(0).max(10000000).nullable().optional(),
  traits: nullableJsonSchema.optional(),
  actions: nullableJsonSchema.optional(),
  bonusActions: nullableJsonSchema.optional(),
  reactions: nullableJsonSchema.optional(),
  legendaryActions: nullableJsonSchema.optional(),
  lairActions: nullableJsonSchema.optional(),
  regionalEffects: nullableJsonSchema.optional(),
  spellcasting: nullableJsonSchema.optional(),
  description: nullableLongTextSchema.optional(),
  sourceBook: z.string().trim().min(1).max(255).nullable().optional(),
  pageNumber: z.string().trim().min(1).max(64).nullable().optional(),
  customData: nullableJsonSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createPublishedMonsterSchema = z
  .object(createPublishedMonsterSchemaShape)
  .strict();

export const copyCatalogMonsterToCampaignSchema = z
  .object({
    campaignId: z.uuid(),
    nameOverride: z.string().trim().min(1).max(200).optional(),
  })
  .strict();

export type CreatePublishedMonsterRequestBody = z.infer<
  typeof createPublishedMonsterSchema
>;
export type CopyCatalogMonsterToCampaignRequestBody = z.infer<
  typeof copyCatalogMonsterToCampaignSchema
>;
