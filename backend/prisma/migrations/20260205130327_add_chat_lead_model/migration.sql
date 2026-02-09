/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_conversationId_fkey";

-- AlterTable
ALTER TABLE "ChatConversation" ALTER COLUMN "history" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "conversationId";

-- CreateTable
CREATE TABLE "ChatLead" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "budget" TEXT,
    "area" TEXT,
    "intent" TEXT,
    "propertyType" TEXT,
    "source" TEXT NOT NULL DEFAULT 'chatbot',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatLead_visitorId_key" ON "ChatLead"("visitorId");
