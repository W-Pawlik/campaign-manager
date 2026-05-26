import { z } from "zod";

const campaignVisibilitySchema = z.enum(["PRIVATE", "PUBLIC"]);

export const createCampaignSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    visibility: campaignVisibilitySchema.optional(),
  })
  .strict();

export const updateCampaignSchema = z
  .object({
    name: z.string().trim().min(3).max(120).optional(),
    visibility: campaignVisibilitySchema.optional(),
  })
  .strict()
  .refine((input) => input.name !== undefined || input.visibility !== undefined, {
    message: "At least one field must be provided",
  });