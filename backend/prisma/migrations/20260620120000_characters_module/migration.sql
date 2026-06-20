-- CreateTable
CREATE TABLE "characters" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "ownerUserId" TEXT,
  "sheetTemplateId" TEXT,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "race" TEXT,
  "characterClass" TEXT,
  "subclass" TEXT,
  "level" INTEGER,
  "background" TEXT,
  "alignment" TEXT,
  "experiencePoints" INTEGER,
  "armorClass" INTEGER,
  "initiativeBonus" INTEGER,
  "speed" TEXT,
  "maxHitPoints" INTEGER,
  "currentHitPoints" INTEGER,
  "temporaryHitPoints" INTEGER,
  "hitDice" TEXT,
  "strength" INTEGER,
  "dexterity" INTEGER,
  "constitution" INTEGER,
  "intelligence" INTEGER,
  "wisdom" INTEGER,
  "charisma" INTEGER,
  "proficiencyBonus" INTEGER,
  "savingThrows" JSONB,
  "skills" JSONB,
  "proficiencies" JSONB,
  "languages" JSONB,
  "attacksAndSpellcasting" JSONB,
  "spellcasting" JSONB,
  "featuresAndTraits" JSONB,
  "personalityTraits" TEXT,
  "ideals" TEXT,
  "bonds" TEXT,
  "flaws" TEXT,
  "backstory" TEXT,
  "appearance" TEXT,
  "customData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "characters_campaignId_idx" ON "characters"("campaignId");

-- CreateIndex
CREATE INDEX "characters_ownerUserId_idx" ON "characters"("ownerUserId");

-- CreateIndex
CREATE INDEX "characters_status_idx" ON "characters"("status");

-- CreateIndex
CREATE INDEX "characters_type_idx" ON "characters"("type");

-- CreateIndex
CREATE INDEX "characters_deletedAt_idx" ON "characters"("deletedAt");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
