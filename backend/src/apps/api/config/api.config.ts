import { env } from "@core/config/env";

export const apiConfig = {
  port: env.API_PORT,
  corsOrigin: env.CORS_ORIGIN,
  corsCredentials: true,
  authRefreshCookie: {
    name: "refreshToken",
    httpOnly: true,
    secure: env.APP_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/v1/auth",
    maxAgeMs: env.AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000,
  },
} as const;
