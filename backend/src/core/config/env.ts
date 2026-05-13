import { config as loadDotenv } from "dotenv";
import { envSchema, type Env } from "@core/config/env.schema";

loadDotenv();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env: Env = parsedEnv.data;