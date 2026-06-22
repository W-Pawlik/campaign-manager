-- CreateTable
CREATE TABLE "external_references" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "externalId" TEXT,
    "key" TEXT,
    "slug" TEXT,
    "url" TEXT,
    "name" TEXT NOT NULL,
    "sourceDocumentKey" TEXT,
    "sourceDocumentName" TEXT,
    "rawData" JSONB NOT NULL,
    "normalizedData" JSONB,
    "cachedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_references_provider_resourceType_key_key" ON "external_references"("provider", "resourceType", "key");

-- CreateIndex
CREATE INDEX "external_references_provider_resourceType_idx" ON "external_references"("provider", "resourceType");

-- CreateIndex
CREATE INDEX "external_references_name_idx" ON "external_references"("name");

-- CreateIndex
CREATE INDEX "external_references_sourceDocumentKey_idx" ON "external_references"("sourceDocumentKey");
