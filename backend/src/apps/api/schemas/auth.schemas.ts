import { z } from "zod";

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8);
const refreshTokenSchema = z.string().min(1);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const refreshTokenSchemaBody = z.object({
  refreshToken: refreshTokenSchema,
});

export const logoutSchema = z.object({
  refreshToken: refreshTokenSchema,
});
