import { z } from "zod";

const campaignVisibilitySchema = z.enum(["PRIVATE", "INVITE_ONLY", "PUBLIC_READ_ONLY"]);
const campaignMemberRoleSchema = z.enum(["OWNER", "GM", "CO_GM", "PLAYER", "OBSERVER"]);

const nullableTrimmedStringSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .nullable();

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
