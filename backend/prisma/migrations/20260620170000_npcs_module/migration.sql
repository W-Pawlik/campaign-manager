-- CreateTable
CREATE TABLE "npcs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "avatarUrl" TEXT,
    "race" TEXT,
    "occupation" TEXT,
    "faction" TEXT,
    "locationId" TEXT,
    "attitude" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publicDescription" TEXT,
    "gmNotes" TEXT,
    "appearance" TEXT,
    "personality" TEXT,
    "motivations" TEXT,
    "secrets" TEXT,
    "statBlock" JSONB,
    "externalReferenceId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "npcs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "npcs_campaignId_idx" ON "npcs"("campaignId");

-- CreateIndex
CREATE INDEX "npcs_locationId_idx" ON "npcs"("locationId");

-- CreateIndex
CREATE INDEX "npcs_createdById_idx" ON "npcs"("createdById");

-- CreateIndex
CREATE INDEX "npcs_status_idx" ON "npcs"("status");

-- CreateIndex
CREATE INDEX "npcs_importance_idx" ON "npcs"("importance");

-- CreateIndex
CREATE INDEX "npcs_deletedAt_idx" ON "npcs"("deletedAt");

-- AddForeignKey
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
