-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "parentLocationId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "gmNotes" TEXT,
    "mapImageUrl" TEXT,
    "coordinates" JSONB,
    "status" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_campaignId_idx" ON "locations"("campaignId");

-- CreateIndex
CREATE INDEX "locations_parentLocationId_idx" ON "locations"("parentLocationId");

-- CreateIndex
CREATE INDEX "locations_createdById_idx" ON "locations"("createdById");

-- CreateIndex
CREATE INDEX "locations_status_idx" ON "locations"("status");

-- CreateIndex
CREATE INDEX "locations_visibility_idx" ON "locations"("visibility");

-- CreateIndex
CREATE INDEX "locations_deletedAt_idx" ON "locations"("deletedAt");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parentLocationId_fkey" FOREIGN KEY ("parentLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
