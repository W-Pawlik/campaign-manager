-- AlterTable
ALTER TABLE "public"."item_templates"
ADD COLUMN "isMagical" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."inventory_items"
ADD COLUMN "source" TEXT NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN "externalReferenceId" TEXT,
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'OTHER',
ADD COLUMN "rarity" TEXT,
ADD COLUMN "isMagical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "weight" DOUBLE PRECISION,
ADD COLUMN "valueAmount" DOUBLE PRECISION,
ADD COLUMN "valueCurrency" TEXT;
