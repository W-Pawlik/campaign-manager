-- CreateTable
CREATE TABLE "public"."fight_encounters" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "environmentName" TEXT NOT NULL,
    "environmentDetails" TEXT NOT NULL,
    "combatantCount" INTEGER NOT NULL DEFAULT 0,
    "conditionCount" INTEGER NOT NULL DEFAULT 0,
    "preparationData" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "fight_encounters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fight_encounter_runs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedById" TEXT NOT NULL,
    "finishedById" TEXT,
    "roundsCompleted" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER,
    "outcomeLabel" TEXT,
    "summaryData" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fight_encounter_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fight_encounters_campaignId_idx" ON "public"."fight_encounters"("campaignId");

-- CreateIndex
CREATE INDEX "fight_encounters_createdById_idx" ON "public"."fight_encounters"("createdById");

-- CreateIndex
CREATE INDEX "fight_encounters_archivedAt_idx" ON "public"."fight_encounters"("archivedAt");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_campaignId_idx" ON "public"."fight_encounter_runs"("campaignId");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_encounterId_idx" ON "public"."fight_encounter_runs"("encounterId");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_startedById_idx" ON "public"."fight_encounter_runs"("startedById");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_finishedById_idx" ON "public"."fight_encounter_runs"("finishedById");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_status_idx" ON "public"."fight_encounter_runs"("status");

-- CreateIndex
CREATE INDEX "fight_encounter_runs_startedAt_idx" ON "public"."fight_encounter_runs"("startedAt");

-- AddForeignKey
ALTER TABLE "public"."fight_encounters" ADD CONSTRAINT "fight_encounters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fight_encounters" ADD CONSTRAINT "fight_encounters_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fight_encounter_runs" ADD CONSTRAINT "fight_encounter_runs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fight_encounter_runs" ADD CONSTRAINT "fight_encounter_runs_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "public"."fight_encounters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fight_encounter_runs" ADD CONSTRAINT "fight_encounter_runs_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fight_encounter_runs" ADD CONSTRAINT "fight_encounter_runs_finishedById_fkey" FOREIGN KEY ("finishedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
