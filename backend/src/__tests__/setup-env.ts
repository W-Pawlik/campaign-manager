process.env.APP_ENV ??= "test";
process.env.LOG_LEVEL ??= "silent";
process.env.API_PORT ??= "3001";
process.env.CORS_ORIGIN ??= "*";
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/campaign_manager_test";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.AWS_REGION ??= "eu-central-1";
process.env.AWS_S3_BUCKET ??= "campaign-manager-test";