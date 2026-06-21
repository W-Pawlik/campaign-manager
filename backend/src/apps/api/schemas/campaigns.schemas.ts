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
const sessionStatusSchema = z.enum(["PLANNED", "CONFIRMED", "COMPLETED", "CANCELLED", "POSTPONED"]);
const sessionLocationTypeSchema = z.enum(["ONLINE", "IN_PERSON", "HYBRID", "UNKNOWN"]);
const chronicleVisibilitySchema = z.enum(["PUBLIC", "GM_ONLY", "DRAFT"]);
const questStatusSchema = z.enum([
  "DRAFT",
  "AVAILABLE",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "FAILED",
  "ABANDONED",
  "HIDDEN",
]);
const questTypeSchema = z.enum(["MAIN", "SIDE", "PERSONAL", "FACTION", "WORLD_EVENT"]);
const questVisibilitySchema = z.enum(["PUBLIC", "GM_ONLY", "DISCOVERED"]);
const questPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]);
const objectiveStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE", "FAILED", "OPTIONAL_SKIPPED"]);
const inventoryOwnerTypeSchema = z.enum(["CHARACTER", "CAMPAIGN_PARTY", "NPC", "LOCATION", "QUEST"]);
const itemVisibilitySchema = z.enum(["PUBLIC", "OWNER_ONLY", "GM_ONLY"]);
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
const nullableDatetimeSchema = z.string().datetime({ offset: true }).nullable();
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

const createOrUpdateSessionSchemaShape = {
  title: z.string().trim().min(1).max(200).optional(),
  description: nullableLongTextSchema.optional(),
  status: sessionStatusSchema.optional(),
  scheduledStartAt: nullableDatetimeSchema.optional(),
  scheduledEndAt: nullableDatetimeSchema.optional(),
  actualStartAt: nullableDatetimeSchema.optional(),
  actualEndAt: nullableDatetimeSchema.optional(),
  locationType: sessionLocationTypeSchema.nullable().optional(),
  locationDetails: nullableLongTextSchema.optional(),
  meetingUrl: nullableUrlSchema.optional(),
  summaryPublic: nullableLongTextSchema.optional(),
  summaryPrivate: nullableLongTextSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createSessionSchema = z
  .object({
    ...createOrUpdateSessionSchemaShape,
    title: z.string().trim().min(1).max(200),
  })
  .strict();

export const updateSessionSchema = z
  .object(createOrUpdateSessionSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateSessionRequestBody = z.infer<typeof createSessionSchema>;
export type UpdateSessionRequestBody = z.infer<typeof updateSessionSchema>;

const createOrUpdateChronicleEntrySchemaShape = {
  sessionId: nullableUuidSchema.optional(),
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).max(20000).optional(),
  inWorldDate: z.string().trim().min(1).max(120).nullable().optional(),
  occurredAt: nullableDatetimeSchema.optional(),
  visibility: chronicleVisibilitySchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createChronicleEntrySchema = z
  .object({
    ...createOrUpdateChronicleEntrySchemaShape,
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(20000),
  })
  .strict();

export const updateChronicleEntrySchema = z
  .object(createOrUpdateChronicleEntrySchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateChronicleEntryRequestBody = z.infer<typeof createChronicleEntrySchema>;
export type UpdateChronicleEntryRequestBody = z.infer<typeof updateChronicleEntrySchema>;

const createOrUpdateQuestSchemaShape = {
  title: z.string().trim().min(1).max(200).optional(),
  description: nullableLongTextSchema.optional(),
  status: questStatusSchema.optional(),
  type: questTypeSchema.optional(),
  visibility: questVisibilitySchema.optional(),
  priority: questPrioritySchema.optional(),
  giverNpcId: nullableUuidSchema.optional(),
  relatedLocationId: nullableUuidSchema.optional(),
  startedAt: nullableDatetimeSchema.optional(),
  completedAt: nullableDatetimeSchema.optional(),
  failedAt: nullableDatetimeSchema.optional(),
  rewardDescription: nullableLongTextSchema.optional(),
  gmNotes: nullableLongTextSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createQuestSchema = z
  .object({
    ...createOrUpdateQuestSchemaShape,
    title: z.string().trim().min(1).max(200),
  })
  .strict();

export const updateQuestSchema = z
  .object(createOrUpdateQuestSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateQuestRequestBody = z.infer<typeof createQuestSchema>;
export type UpdateQuestRequestBody = z.infer<typeof updateQuestSchema>;

const createOrUpdateQuestObjectiveSchemaShape = {
  title: z.string().trim().min(1).max(200).optional(),
  description: nullableLongTextSchema.optional(),
  status: objectiveStatusSchema.optional(),
  sortOrder: z.number().int().min(0).optional(),
} satisfies Record<string, z.ZodType>;

export const createQuestObjectiveSchema = z
  .object({
    ...createOrUpdateQuestObjectiveSchemaShape,
    title: z.string().trim().min(1).max(200),
  })
  .strict();

export const updateQuestObjectiveSchema = z
  .object(createOrUpdateQuestObjectiveSchemaShape)
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateQuestObjectiveRequestBody = z.infer<typeof createQuestObjectiveSchema>;
export type UpdateQuestObjectiveRequestBody = z.infer<typeof updateQuestObjectiveSchema>;

const createInventoryItemSchemaShape = {
  itemTemplateId: nullableUuidSchema.optional(),
  name: z.string().trim().min(1).max(200).optional(),
  description: nullableLongTextSchema.optional(),
  quantity: z.number().int().min(0).optional(),
  charges: z.number().int().min(0).nullable().optional(),
  maxCharges: z.number().int().min(0).nullable().optional(),
  isEquipped: z.boolean().optional(),
  isAttuned: z.boolean().optional(),
  isIdentified: z.boolean().optional(),
  ownerType: inventoryOwnerTypeSchema.optional(),
  ownerId: z.uuid().optional(),
  visibility: itemVisibilitySchema.optional(),
  customProperties: nullableJsonSchema.optional(),
} satisfies Record<string, z.ZodType>;

export const createInventoryItemSchema = z
  .object({
    ...createInventoryItemSchemaShape,
    ownerType: inventoryOwnerTypeSchema,
    ownerId: z.uuid(),
  })
  .strict()
  .refine((input) => input.itemTemplateId !== undefined || input.name !== undefined, {
    message: "itemTemplateId or name must be provided",
  });

export const updateInventoryItemSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: nullableLongTextSchema.optional(),
    quantity: z.number().int().min(0).optional(),
    charges: z.number().int().min(0).nullable().optional(),
    maxCharges: z.number().int().min(0).nullable().optional(),
    isAttuned: z.boolean().optional(),
    isIdentified: z.boolean().optional(),
    visibility: itemVisibilitySchema.optional(),
    customProperties: nullableJsonSchema.optional(),
  })
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const transferInventoryItemSchema = z
  .object({
    targetOwnerType: inventoryOwnerTypeSchema,
    targetOwnerId: z.uuid(),
    quantity: z.number().int().min(1).optional(),
  })
  .strict();

export type CreateInventoryItemRequestBody = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemRequestBody = z.infer<typeof updateInventoryItemSchema>;
export type TransferInventoryItemRequestBody = z.infer<typeof transferInventoryItemSchema>;

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
