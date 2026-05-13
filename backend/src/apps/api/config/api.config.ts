import { env } from "@core/config/env";

export const apiConfig = {
  port: env.API_PORT,
  corsOrigin: env.CORS_ORIGIN,
} as const;