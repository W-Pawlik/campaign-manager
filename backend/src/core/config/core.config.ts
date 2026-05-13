import { env } from "@core/config/env";

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
  aws: {
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },
} as const;