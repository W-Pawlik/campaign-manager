import { z } from "zod";

export const envSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  API_PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().min(1).default("*"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  AUTH_ACCESS_TOKEN_ACTIVE_KID: z.string().min(1),
  AUTH_ACCESS_TOKEN_ACTIVE_SECRET: z.string().min(1),
  AUTH_ACCESS_TOKEN_PREVIOUS_KID: z.string().min(1).optional(),
  AUTH_ACCESS_TOKEN_PREVIOUS_SECRET: z.string().min(1).optional(),
  AUTH_REFRESH_TOKEN_ACTIVE_KID: z.string().min(1),
  AUTH_REFRESH_TOKEN_ACTIVE_SECRET: z.string().min(1),
  AUTH_REFRESH_TOKEN_PREVIOUS_KID: z.string().min(1).optional(),
  AUTH_REFRESH_TOKEN_PREVIOUS_SECRET: z.string().min(1).optional(),
  AUTH_ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  AUTH_REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
}).superRefine((env, context) => {
  const hasPreviousAccessKid = env.AUTH_ACCESS_TOKEN_PREVIOUS_KID !== undefined;
  const hasPreviousAccessSecret = env.AUTH_ACCESS_TOKEN_PREVIOUS_SECRET !== undefined;

  if (hasPreviousAccessKid !== hasPreviousAccessSecret) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "AUTH_ACCESS_TOKEN_PREVIOUS_KID and AUTH_ACCESS_TOKEN_PREVIOUS_SECRET must be set together",
      path: ["AUTH_ACCESS_TOKEN_PREVIOUS_KID"],
    });
  }

  const hasPreviousRefreshKid = env.AUTH_REFRESH_TOKEN_PREVIOUS_KID !== undefined;
  const hasPreviousRefreshSecret = env.AUTH_REFRESH_TOKEN_PREVIOUS_SECRET !== undefined;

  if (hasPreviousRefreshKid !== hasPreviousRefreshSecret) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "AUTH_REFRESH_TOKEN_PREVIOUS_KID and AUTH_REFRESH_TOKEN_PREVIOUS_SECRET must be set together",
      path: ["AUTH_REFRESH_TOKEN_PREVIOUS_KID"],
    });
  }
});

export type Env = z.infer<typeof envSchema>;
