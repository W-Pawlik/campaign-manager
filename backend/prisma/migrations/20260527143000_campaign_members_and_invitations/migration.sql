-- AlterTable
ALTER TABLE "campaign_members"
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "campaign_invitations" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "invitedById" TEXT NOT NULL,
  "respondedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "campaign_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_invitations_campaignId_idx" ON "campaign_invitations"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_invitations_userId_idx" ON "campaign_invitations"("userId");

-- CreateIndex
CREATE INDEX "campaign_invitations_status_idx" ON "campaign_invitations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_invitations_campaignId_userId_status_key"
ON "campaign_invitations"("campaignId", "userId", "status");

-- AddForeignKey
ALTER TABLE "campaign_invitations" ADD CONSTRAINT "campaign_invitations_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_invitations" ADD CONSTRAINT "campaign_invitations_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_invitations" ADD CONSTRAINT "campaign_invitations_invitedById_fkey"
FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
