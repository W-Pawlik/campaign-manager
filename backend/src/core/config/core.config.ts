import { env } from "@core/config/env";

export interface JwtSigningKeyConfig {
  kid: string;
  secret: string;
}

export interface RotatingJwtSigningKeysConfig {
  active: JwtSigningKeyConfig;
  previous?: JwtSigningKeyConfig;
}

export const coreConfig = {
  app: {
    env: env.APP_ENV,
  },
  logger: {
    level: env.LOG_LEVEL,
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  auth: {
    accessTokenKeys: {
      active: {
        kid: env.AUTH_ACCESS_TOKEN_ACTIVE_KID,
        secret: env.AUTH_ACCESS_TOKEN_ACTIVE_SECRET,
      },
      ...(env.AUTH_ACCESS_TOKEN_PREVIOUS_KID !== undefined &&
      env.AUTH_ACCESS_TOKEN_PREVIOUS_SECRET !== undefined
        ? {
            previous: {
              kid: env.AUTH_ACCESS_TOKEN_PREVIOUS_KID,
              secret: env.AUTH_ACCESS_TOKEN_PREVIOUS_SECRET,
            },
          }
        : {}),
    } satisfies RotatingJwtSigningKeysConfig,
    refreshTokenKeys: {
      active: {
        kid: env.AUTH_REFRESH_TOKEN_ACTIVE_KID,
        secret: env.AUTH_REFRESH_TOKEN_ACTIVE_SECRET,
      },
      ...(env.AUTH_REFRESH_TOKEN_PREVIOUS_KID !== undefined &&
      env.AUTH_REFRESH_TOKEN_PREVIOUS_SECRET !== undefined
        ? {
            previous: {
              kid: env.AUTH_REFRESH_TOKEN_PREVIOUS_KID,
              secret: env.AUTH_REFRESH_TOKEN_PREVIOUS_SECRET,
            },
          }
        : {}),
    } satisfies RotatingJwtSigningKeysConfig,
    accessTokenTtlSeconds: env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
  },
  aws: {
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },
} as const;
