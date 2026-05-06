/*
  Warnings:

  - You are about to drop the column `completed` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `users` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETED', 'MISSED');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('LOCKED_IN', 'GOOD', 'TIRED', 'BURNED_OUT', 'DISTRACTED');

-- DropIndex
DROP INDEX "tasks_userId_completed_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "completed",
DROP COLUMN "description",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "xp",
ADD COLUMN     "currentXP" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveDate" TIMESTAMP(3),
ADD COLUMN     "totalXP" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "journals" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed" TEXT,
    "distractedBy" TEXT,
    "biggestWin" TEXT,
    "tomorrowFocus" TEXT,
    "mood" "Mood" NOT NULL DEFAULT 'GOOD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journals_userId_idx" ON "journals"("userId");

-- CreateIndex
CREATE INDEX "journals_userId_date_idx" ON "journals"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "journals_userId_date_key" ON "journals"("userId", "date");

-- CreateIndex
CREATE INDEX "tasks_userId_status_idx" ON "tasks"("userId", "status");

-- CreateIndex
CREATE INDEX "tasks_expiresAt_status_idx" ON "tasks"("expiresAt", "status");

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
