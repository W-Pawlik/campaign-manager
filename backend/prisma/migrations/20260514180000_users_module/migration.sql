-- AlterTable
ALTER TABLE "users"
ADD COLUMN "username" TEXT,
ADD COLUMN "displayName" TEXT,
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "bio" TEXT,
ADD COLUMN "timezone" TEXT,
ADD COLUMN "locale" TEXT,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "lastLoginAt" TIMESTAMP(3),
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Backfill existing rows before NOT NULL constraints
UPDATE "users"
SET
  "username" = CONCAT('user_', SUBSTRING("id" FROM 1 FOR 8)),
  "displayName" = COALESCE(NULLIF(SPLIT_PART("email", '@', 1), ''), 'User')
WHERE "username" IS NULL OR "displayName" IS NULL;

-- Enforce required columns
ALTER TABLE "users"
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "displayName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateTable
CREATE TABLE "user_profiles" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "preferredSystem" TEXT,
  "defaultTimezone" TEXT,
  "socialLinks" JSONB,
  "settings" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
