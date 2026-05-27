-- AlterTable
ALTER TABLE "campaigns"
ADD COLUMN "ownerId" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "gameSystemId" TEXT,
ADD COLUMN "coverImageUrl" TEXT,
ADD COLUMN "coverImageKey" TEXT,
ADD COLUMN "defaultLanguage" TEXT,
ADD COLUMN "currentDateInWorld" TEXT,
ADD COLUMN "worldName" TEXT,
ADD COLUMN "startingLevel" INTEGER,
ADD COLUMN "archivedAt" TIMESTAMP(3);

-- Backfill ownerId from existing OWNER memberships.
UPDATE "campaigns" AS "campaign"
SET "ownerId" = "ownerMembership"."userId"
FROM (
  SELECT DISTINCT ON ("campaignId") "campaignId", "userId"
  FROM "campaign_members"
  WHERE "role" = 'OWNER'
  ORDER BY "campaignId", "createdAt" ASC
) AS "ownerMembership"
WHERE "campaign"."id" = "ownerMembership"."campaignId";

-- Backfill ownerId from any membership if older local data has no OWNER row.
UPDATE "campaigns" AS "campaign"
SET "ownerId" = "membership"."userId"
FROM (
  SELECT DISTINCT ON ("campaignId") "campaignId", "userId"
  FROM "campaign_members"
  ORDER BY "campaignId", "createdAt" ASC
) AS "membership"
WHERE "campaign"."id" = "membership"."campaignId"
  AND "campaign"."ownerId" IS NULL;

ALTER TABLE "campaigns" ALTER COLUMN "ownerId" SET NOT NULL;

UPDATE "campaigns"
SET "archivedAt" = "deletedAt"
WHERE "deletedAt" IS NOT NULL
  AND "archivedAt" IS NULL;

-- AlterTable
ALTER TABLE "campaign_members"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "nickname" TEXT,
ADD COLUMN "joinedAt" TIMESTAMP(3),
ADD COLUMN "invitedAt" TIMESTAMP(3),
ADD COLUMN "invitedById" TEXT;

UPDATE "campaign_members"
SET "joinedAt" = "createdAt"
WHERE "joinedAt" IS NULL
  AND "status" = 'ACTIVE';

-- CreateIndex
CREATE INDEX "campaigns_ownerId_idx" ON "campaigns"("ownerId");

-- CreateIndex
CREATE INDEX "campaign_members_status_idx" ON "campaign_members"("status");

-- CreateIndex
CREATE INDEX "campaign_members_invitedById_idx" ON "campaign_members"("invitedById");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_invitedById_fkey"
FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
