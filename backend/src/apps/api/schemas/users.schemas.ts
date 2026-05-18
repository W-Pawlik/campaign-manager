import { z } from "zod";

export const updateCurrentUserProfileSchema = z
  .object({
    username: z.string().trim().min(3).max(32).regex(/^[A-Za-z0-9_-]+$/).optional(),
    displayName: z.string().trim().min(2).max(80).optional(),
    avatarUrl: z.string().trim().url().nullable().optional(),
    bio: z.string().max(1000).nullable().optional(),
    timezone: z.string().trim().min(1).nullable().optional(),
    locale: z.string().trim().min(1).nullable().optional(),
    profile: z
      .object({
        preferredSystem: z.string().trim().min(1).nullable().optional(),
        defaultTimezone: z.string().trim().min(1).nullable().optional(),
        socialLinks: z.unknown().optional(),
        settings: z.unknown().optional(),
      })
      .optional(),
  })
  .strict();

export const changeCurrentUserPasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
  })
  .strict();
