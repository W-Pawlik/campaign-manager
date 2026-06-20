import { z } from "zod";

const campaignVisibilitySchema = z.enum(["PRIVATE", "INVITE_ONLY", "PUBLIC_READ_ONLY"]);
const campaignMemberRoleSchema = z.enum(["OWNER", "GM", "CO_GM", "PLAYER", "OBSERVER"]);
const characterTypeSchema = z.enum(["PLAYER_CHARACTER", "COMPANION", "TEMPORARY"]);
const characterStatusSchema = z.enum([
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "DEAD",
  "RETIRED",
  "ARCHIVED",
]);
const npcAttitudeSchema = z.enum(["FRIENDLY", "NEUTRAL", "HOSTILE", "UNKNOWN"]);
const npcImportanceSchema = z.enum(["MINOR", "SUPPORTING", "MAJOR", "BOSS"]);
const npcStatusSchema = z.enum(["ALIVE", "DEAD", "MISSING", "UNKNOWN", "ARCHIVED"]);
const locationTypeSchema = z.enum([
  "WORLD",
  "CONTINENT",
  "REGION",
  "KINGDOM",
  "CITY",
  "DISTRICT",
  "BUILDING",
  "DUNGEON",
  "ROOM",
  "LANDMARK",
  "PLANE",
  "OTHER",
]);
const locationStatusSchema = z.enum(["ACTIVE", "DESTROYED", "LOST", "HIDDEN", "ARCHIVED"]);
const locationVisibilitySchema = z.enum(["PUBLIC", "DISCOVERED", "GM_ONLY"]);
const noteVisibilitySchema = z.enum([
  "PRIVATE_AUTHOR",
  "PRIVATE_GM",
  "CAMPAIGN_PUBLIC",
  "SESSION_PUBLIC",
  "CHARACTER_OWNER",
]);
const noteCategorySchema = z.enum([
  "GENERAL",
  "SESSION",
  "CHARACTER",
  "QUEST",
  "LOCATION",
  "NPC",
  "ITEM",
  "LORE",
  "GM_SECRET",
  "PLAYER_NOTE",
]);
const relatedEntityTypeSchema = z.enum([
  "CAMPAIGN",
  "SESSION",
  "CHARACTER",
  "NPC",
  "QUEST",
  "LOCATION",
  "ITEM",
  "CHRONICLE_ENTRY",
]);

const nullableTrimmedStringSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .nullable();
const nullableLongTextSchema = z.string().trim().min(1).max(10000).nullable();
const nullableJsonSchema = z.unknown().nullable();
const nullableUuidSchema = z.uuid().nullable();
const nullableUrlSchema = z.string().trim().url().nullable();
const optionalAbilityScoreSchema = z.number().int().min(1).max(30).nullable().optional();

export const createCampaignSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().min(1).max(5000).nullable().optional(),
    gameSystemId: z.uuid().nullable().optional(),
    visibility: campaignVisibilitySchema.optional(),
    defaultLanguage: z.string().trim().min(2).max(12).nullable().optional(),
    currentDateInWorld: nullableTrimmedStringSchema.optional(),
    worldName: z.string().trim().min(1).max(120).nullable().optional(),
    startingLevel: z.number().int().min(1).max(30).nullable().optional(),
  })
  .strict();

export const updateCampaignSchema = z
  .object({
    name: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().min(1).max(5000).nullable().optional(),
    gameSystemId: z.uuid().nullable().optional(),
    visibility: campaignVisibilitySchema.optional(),
    defaultLanguage: z.string().trim().min(2).max(12).nullable().optional(),
    currentDateInWorld: nullableTrimmedStringSchema.optional(),
    worldName: z.string().trim().min(1).max(120).nullable().optional(),
    startingLevel: z.number().int().min(1).max(30).nullable().optional(),
  })
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const createCampaignCoverImageUploadSchema = z
  .object({
    fileName: z.string().trim().min(1).max(255),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  })
  .strict();

export const inviteCampaignMemberSchema = z
  .object({
    userId: z.string().trim().min(1),
    role: campaignMemberRoleSchema.exclude(["OWNER"]),
  })
  .strict();

export const updateCampaignMemberSchema = z
  .object({
    role: campaignMemberRoleSchema,
  })
  .strict();

const createOrUpdateCharacterSchemaShape = {
  ownerUserId: nullableUuidSchema.optional(),
  sheetTemplateId: nullableUuidSchema.optional(),
  name: z.string().trim().min(1).max(120).optional(),
  avatarUrl: nullableUrlSchema.optional(),
  type: characterTypeSchema.optional(),
  status: characterStatusSchema.optional(),
  race: z.string().trim().min(1).max(120).nullable().optional(),
  characterClass: z.string().trim().min(1).max(120).nullable().optional(),
  subclass: z.string().trim().min(1).max(120).nullable().optional(),
  level: z.number().int().min(1).max(30).nullable().optional(),
  background: z.string().trim().min(1).max(255).nullable().optional(),
  alignment: z.string().trim().min(1).max(80).nullable().optional(),
  experiencePoints: z.number().int().min(0).nullable().optional(),
  armorClass: z.number().int().min(0).max(99).nullable().optional(),
  initiativeBonus: z.number().int().min(-20).max(20).nullable().optional(),
  speed: z.string().trim().min(1).max(80).nullable().optional(),
  maxHitPoints: z.number().int().min(0).max(999).nullable().optional(),
  currentHitPoints: z.number().int().min(0).max(999).nullable().optional(),
  temporaryHitPoints: z.number().int().min(0).max(999).nullable().optional(),
  hitDice: z.string().trim().min(1).max(80).nullable().optional(),
  strength: optionalAbilityScoreSchema,
  dexterity: optionalAbilityScoreSchema,
  constitution: optionalAbilityScoreSchema,
  intelligence: optionalAbilityScoreSchema,
  wisdom: optionalAbilityScoreSchema,
  charisma: optionalAbilityScoreSchema,
  proficiencyBonus: z.number().int().min(0).max(20).nullable().optional(),
  savingThrows: nullableJsonSchema.optional(),
  skills: nullableJsonSchema.optional(),
  proficiencies: nullableJsonSchema.optional(),
  languages: nullableJsonSchema.optional(),
  attacksAndSpellcasting: nullableJsonSchema.optional(),
  spellcasting: nullableJsonSchema.optional(),
  featuresAndTraits: nullableJsonSchema.optional(),
  personalityTraits: nullableLongTextSchema.optional(),
  ideals: nullableLongTextSchema.optional(),
  bonds: nullableLongTextSchema.optional(),
  flaws: nullableLongTextSchema.optional(),
  backstory: nullableLongTextSchema.optional(),
  appearance: nullableLongTextSchema.optional(),
  customData: nullableJsonSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createCharacterSchema = z
  .object({
    ...createOrUpdateCharacterSchemaShape,
    name: z.string().trim().min(1).max(120),
  })
  .strict();

export const updateCharacterSchema = z
  .object(createOrUpdateCharacterSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateCharacterRequestBody = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterRequestBody = z.infer<typeof updateCharacterSchema>;

const createOrUpdateNpcSchemaShape = {
  name: z.string().trim().min(1).max(120).optional(),
  title: z.string().trim().min(1).max(120).nullable().optional(),
  avatarUrl: nullableUrlSchema.optional(),
  race: z.string().trim().min(1).max(120).nullable().optional(),
  occupation: z.string().trim().min(1).max(120).nullable().optional(),
  faction: z.string().trim().min(1).max(120).nullable().optional(),
  locationId: nullableUuidSchema.optional(),
  attitude: npcAttitudeSchema.optional(),
  importance: npcImportanceSchema.optional(),
  status: npcStatusSchema.optional(),
  publicDescription: nullableLongTextSchema.optional(),
  gmNotes: nullableLongTextSchema.optional(),
  appearance: nullableLongTextSchema.optional(),
  personality: nullableLongTextSchema.optional(),
  motivations: nullableLongTextSchema.optional(),
  secrets: nullableLongTextSchema.optional(),
  statBlock: nullableJsonSchema.optional(),
  externalReferenceId: nullableUuidSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createNpcSchema = z
  .object({
    ...createOrUpdateNpcSchemaShape,
    name: z.string().trim().min(1).max(120),
  })
  .strict();

export const updateNpcSchema = z
  .object(createOrUpdateNpcSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateNpcRequestBody = z.infer<typeof createNpcSchema>;
export type UpdateNpcRequestBody = z.infer<typeof updateNpcSchema>;

const createOrUpdateLocationSchemaShape = {
  parentLocationId: nullableUuidSchema.optional(),
  name: z.string().trim().min(1).max(120).optional(),
  type: locationTypeSchema.optional(),
  shortDescription: nullableLongTextSchema.optional(),
  description: nullableLongTextSchema.optional(),
  gmNotes: nullableLongTextSchema.optional(),
  mapImageUrl: nullableUrlSchema.optional(),
  coordinates: nullableJsonSchema.optional(),
  status: locationStatusSchema.optional(),
  visibility: locationVisibilitySchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createLocationSchema = z
  .object({
    ...createOrUpdateLocationSchemaShape,
    name: z.string().trim().min(1).max(120),
  })
  .strict();

export const updateLocationSchema = z
  .object(createOrUpdateLocationSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateLocationRequestBody = z.infer<typeof createLocationSchema>;
export type UpdateLocationRequestBody = z.infer<typeof updateLocationSchema>;

const createOrUpdateNoteSchemaShape = {
  title: z.string().trim().min(1).max(200).nullable().optional(),
  content: z.string().trim().min(1).max(20000).optional(),
  visibility: noteVisibilitySchema.optional(),
  category: noteCategorySchema.optional(),
  relatedEntityType: relatedEntityTypeSchema.nullable().optional(),
  relatedEntityId: nullableUuidSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createNoteSchema = z
  .object({
    ...createOrUpdateNoteSchemaShape,
    content: z.string().trim().min(1).max(20000),
  })
  .strict();

export const updateNoteSchema = z
  .object(createOrUpdateNoteSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateNoteRequestBody = z.infer<typeof createNoteSchema>;
export type UpdateNoteRequestBody = z.infer<typeof updateNoteSchema>;
