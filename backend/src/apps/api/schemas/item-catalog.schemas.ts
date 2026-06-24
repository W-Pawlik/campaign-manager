import { z } from "zod";

const itemTypeSchema = z.enum([
  "WEAPON",
  "ARMOR",
  "SHIELD",
  "POTION",
  "SCROLL",
  "WONDROUS_ITEM",
  "TOOL",
  "GEAR",
  "TREASURE",
  "QUEST_ITEM",
  "CONSUMABLE",
  "OTHER",
]);
const itemRaritySchema = z.enum([
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "LEGENDARY",
  "ARTIFACT",
  "UNKNOWN",
]);
const inventoryOwnerTypeSchema = z.enum([
  "CHARACTER",
  "CAMPAIGN_PARTY",
  "NPC",
  "LOCATION",
  "QUEST",
  "SESSION",
]);
const itemVisibilitySchema = z.enum(["PUBLIC", "OWNER_ONLY", "GM_ONLY"]);

const nullableLongTextSchema = z.string().trim().min(1).max(10000).nullable();
const nullableJsonSchema = z.unknown().nullable();

const createPublishedItemSchemaShape = {
  name: z.string().trim().min(1).max(200),
  type: itemTypeSchema.optional(),
  rarity: itemRaritySchema.nullable().optional(),
  isMagical: z.boolean().optional(),
  description: nullableLongTextSchema.optional(),
  properties: nullableJsonSchema.optional(),
  weight: z.number().min(0).nullable().optional(),
  valueAmount: z.number().min(0).nullable().optional(),
  valueCurrency: z.string().trim().min(1).max(16).nullable().optional(),
} satisfies Record<string, z.ZodType>;

export const createPublishedItemSchema = z.object(createPublishedItemSchemaShape).strict();

export const updatePublishedItemSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    type: itemTypeSchema.optional(),
    rarity: itemRaritySchema.nullable().optional(),
    isMagical: z.boolean().optional(),
    description: nullableLongTextSchema.optional(),
    properties: nullableJsonSchema.optional(),
    weight: z.number().min(0).nullable().optional(),
    valueAmount: z.number().min(0).nullable().optional(),
    valueCurrency: z.string().trim().min(1).max(16).nullable().optional(),
  })
  .strict()
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const copyCatalogItemToCampaignSchema = z
  .object({
    campaignId: z.uuid(),
    ownerType: inventoryOwnerTypeSchema,
    ownerId: z.uuid(),
    quantity: z.number().int().min(1).optional(),
    charges: z.number().int().min(0).nullable().optional(),
    maxCharges: z.number().int().min(0).nullable().optional(),
    isAttuned: z.boolean().optional(),
    isIdentified: z.boolean().optional(),
    visibility: itemVisibilitySchema.optional(),
    nameOverride: z.string().trim().min(1).max(200).optional(),
    customProperties: nullableJsonSchema.optional(),
  })
  .strict();

export type CreatePublishedItemRequestBody = z.infer<typeof createPublishedItemSchema>;
export type UpdatePublishedItemRequestBody = z.infer<typeof updatePublishedItemSchema>;
export type CopyCatalogItemToCampaignRequestBody = z.infer<typeof copyCatalogItemToCampaignSchema>;
