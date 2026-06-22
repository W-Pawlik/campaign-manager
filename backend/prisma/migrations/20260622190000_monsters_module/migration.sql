-- CreateTable
CREATE TABLE "monsters" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "gameSystemId" TEXT,
    "source" TEXT NOT NULL,
    "externalReferenceId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "size" TEXT,
    "type" TEXT,
    "subtype" TEXT,
    "alignment" TEXT,
    "armorClass" INTEGER,
    "armorClassDetails" TEXT,
    "hitPoints" INTEGER,
    "hitDice" TEXT,
    "speed" JSONB,
    "strength" INTEGER,
    "dexterity" INTEGER,
    "constitution" INTEGER,
    "intelligence" INTEGER,
    "wisdom" INTEGER,
    "charisma" INTEGER,
    "savingThrows" JSONB,
    "skills" JSONB,
    "damageResistances" JSONB,
    "damageImmunities" JSONB,
    "conditionImmunities" JSONB,
    "damageVulnerabilities" JSONB,
    "senses" TEXT,
    "languages" TEXT,
    "challengeRating" TEXT,
    "challengeRatingDecimal" DOUBLE PRECISION,
    "proficiencyBonus" INTEGER,
    "xp" INTEGER,
    "traits" JSONB,
    "actions" JSONB,
    "bonusActions" JSONB,
    "reactions" JSONB,
    "legendaryActions" JSONB,
    "lairActions" JSONB,
    "regionalEffects" JSONB,
    "spellcasting" JSONB,
    "description" TEXT,
    "sourceBook" TEXT,
    "pageNumber" TEXT,
    "visibility" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rawData" JSONB,
    "customData" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "monsters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monsters_campaignId_slug_key" ON "monsters"("campaignId", "slug");

-- CreateIndex
CREATE INDEX "monsters_campaignId_idx" ON "monsters"("campaignId");

-- CreateIndex
CREATE INDEX "monsters_source_idx" ON "monsters"("source");

-- CreateIndex
CREATE INDEX "monsters_externalReferenceId_idx" ON "monsters"("externalReferenceId");

-- CreateIndex
CREATE INDEX "monsters_name_idx" ON "monsters"("name");

-- CreateIndex
CREATE INDEX "monsters_challengeRatingDecimal_idx" ON "monsters"("challengeRatingDecimal");

-- CreateIndex
CREATE INDEX "monsters_type_idx" ON "monsters"("type");

-- CreateIndex
CREATE INDEX "monsters_deletedAt_idx" ON "monsters"("deletedAt");

-- AddForeignKey
ALTER TABLE "monsters" ADD CONSTRAINT "monsters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monsters" ADD CONSTRAINT "monsters_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
