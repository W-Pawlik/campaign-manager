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
  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;