-- CreateTable
CREATE TABLE "public"."game_sessions" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "scheduledStartAt" TIMESTAMP(3),
    "scheduledEndAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "locationType" TEXT,
    "locationDetails" TEXT,
    "meetingUrl" TEXT,
    "summaryPublic" TEXT,
    "summaryPrivate" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_participants" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "attendanceStatus" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chronicle_entries" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "sessionId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "inWorldDate" TEXT,
    "occurredAt" TIMESTAMP(3),
    "visibility" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chronicle_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quests" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "giverNpcId" TEXT,
    "relatedLocationId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "rewardDescription" TEXT,
    "gmNotes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quest_objectives" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quest_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quest_relations" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_templates" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalReferenceId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT,
    "description" TEXT,
    "properties" JSONB,
    "weight" DOUBLE PRECISION,
    "valueAmount" DOUBLE PRECISION,
    "valueCurrency" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_items" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "itemTemplateId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "charges" INTEGER,
    "maxCharges" INTEGER,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "isAttuned" BOOLEAN NOT NULL DEFAULT false,
    "isIdentified" BOOLEAN NOT NULL DEFAULT true,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "customProperties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_sessions_campaignId_idx" ON "public"."game_sessions"("campaignId");

-- CreateIndex
CREATE INDEX "game_sessions_createdById_idx" ON "public"."game_sessions"("createdById");

-- CreateIndex
CREATE INDEX "game_sessions_status_idx" ON "public"."game_sessions"("status");

-- CreateIndex
CREATE INDEX "game_sessions_scheduledStartAt_idx" ON "public"."game_sessions"("scheduledStartAt");

-- CreateIndex
CREATE INDEX "game_sessions_cancelledAt_idx" ON "public"."game_sessions"("cancelledAt");

-- CreateIndex
CREATE INDEX "session_participants_sessionId_idx" ON "public"."session_participants"("sessionId");

-- CreateIndex
CREATE INDEX "session_participants_userId_idx" ON "public"."session_participants"("userId");

-- CreateIndex
CREATE INDEX "session_participants_characterId_idx" ON "public"."session_participants"("characterId");

-- CreateIndex
CREATE INDEX "session_participants_attendanceStatus_idx" ON "public"."session_participants"("attendanceStatus");

-- CreateIndex
CREATE UNIQUE INDEX "session_participants_sessionId_userId_key" ON "public"."session_participants"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "chronicle_entries_campaignId_idx" ON "public"."chronicle_entries"("campaignId");

-- CreateIndex
CREATE INDEX "chronicle_entries_sessionId_idx" ON "public"."chronicle_entries"("sessionId");

-- CreateIndex
CREATE INDEX "chronicle_entries_createdById_idx" ON "public"."chronicle_entries"("createdById");

-- CreateIndex
CREATE INDEX "chronicle_entries_visibility_idx" ON "public"."chronicle_entries"("visibility");

-- CreateIndex
CREATE INDEX "chronicle_entries_occurredAt_idx" ON "public"."chronicle_entries"("occurredAt");

-- CreateIndex
CREATE INDEX "quests_campaignId_idx" ON "public"."quests"("campaignId");

-- CreateIndex
CREATE INDEX "quests_status_idx" ON "public"."quests"("status");

-- CreateIndex
CREATE INDEX "quests_visibility_idx" ON "public"."quests"("visibility");

-- CreateIndex
CREATE INDEX "quests_createdById_idx" ON "public"."quests"("createdById");

-- CreateIndex
CREATE INDEX "quests_giverNpcId_idx" ON "public"."quests"("giverNpcId");

-- CreateIndex
CREATE INDEX "quests_relatedLocationId_idx" ON "public"."quests"("relatedLocationId");

-- CreateIndex
CREATE INDEX "quests_deletedAt_idx" ON "public"."quests"("deletedAt");

-- CreateIndex
CREATE INDEX "quest_objectives_questId_idx" ON "public"."quest_objectives"("questId");

-- CreateIndex
CREATE INDEX "quest_objectives_status_idx" ON "public"."quest_objectives"("status");

-- CreateIndex
CREATE INDEX "quest_objectives_sortOrder_idx" ON "public"."quest_objectives"("sortOrder");

-- CreateIndex
CREATE INDEX "quest_relations_questId_idx" ON "public"."quest_relations"("questId");

-- CreateIndex
CREATE INDEX "quest_relations_entityType_entityId_idx" ON "public"."quest_relations"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "quest_relations_questId_entityType_entityId_relationType_key" ON "public"."quest_relations"("questId", "entityType", "entityId", "relationType");

-- CreateIndex
CREATE INDEX "item_templates_source_idx" ON "public"."item_templates"("source");

-- CreateIndex
CREATE INDEX "item_templates_type_idx" ON "public"."item_templates"("type");

-- CreateIndex
CREATE INDEX "inventory_items_campaignId_idx" ON "public"."inventory_items"("campaignId");

-- CreateIndex
CREATE INDEX "inventory_items_itemTemplateId_idx" ON "public"."inventory_items"("itemTemplateId");

-- CreateIndex
CREATE INDEX "inventory_items_ownerType_ownerId_idx" ON "public"."inventory_items"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "inventory_items_visibility_idx" ON "public"."inventory_items"("visibility");

-- CreateIndex
CREATE INDEX "inventory_items_deletedAt_idx" ON "public"."inventory_items"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session_participants" ADD CONSTRAINT "session_participants_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session_participants" ADD CONSTRAINT "session_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chronicle_entries" ADD CONSTRAINT "chronicle_entries_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chronicle_entries" ADD CONSTRAINT "chronicle_entries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."game_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chronicle_entries" ADD CONSTRAINT "chronicle_entries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quests" ADD CONSTRAINT "quests_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quests" ADD CONSTRAINT "quests_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quest_objectives" ADD CONSTRAINT "quest_objectives_questId_fkey" FOREIGN KEY ("questId") REFERENCES "public"."quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quest_relations" ADD CONSTRAINT "quest_relations_questId_fkey" FOREIGN KEY ("questId") REFERENCES "public"."quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
