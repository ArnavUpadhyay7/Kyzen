-- Replace journals with workspace tables

DROP TABLE IF EXISTS "journals";

CREATE TABLE "battle_logs" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" "Mood" NOT NULL DEFAULT 'GOOD',
    "completed" TEXT,
    "win" TEXT,
    "learned" TEXT,
    "bug" TEXT,
    "tomorrow" TEXT,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "userLevel" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "battle_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workspace_ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "IdeaCategory" NOT NULL DEFAULT 'PROJECT',
    "problem" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_ideas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workspace_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "why" TEXT,
    "mvp" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stretch" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tech" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workspace_inspirations" (
    "id" TEXT NOT NULL,
    "type" "InspirationType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_inspirations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workspace_notes" (
    "id" TEXT NOT NULL,
    "category" "NoteCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isCode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_notes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "battle_logs_userId_date_key" ON "battle_logs"("userId", "date");
CREATE INDEX "battle_logs_userId_idx" ON "battle_logs"("userId");
CREATE INDEX "battle_logs_userId_date_idx" ON "battle_logs"("userId", "date");
CREATE INDEX "workspace_ideas_userId_idx" ON "workspace_ideas"("userId");
CREATE INDEX "workspace_projects_userId_idx" ON "workspace_projects"("userId");
CREATE INDEX "workspace_inspirations_userId_idx" ON "workspace_inspirations"("userId");
CREATE INDEX "workspace_notes_userId_idx" ON "workspace_notes"("userId");

ALTER TABLE "battle_logs" ADD CONSTRAINT "battle_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_ideas" ADD CONSTRAINT "workspace_ideas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_projects" ADD CONSTRAINT "workspace_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_inspirations" ADD CONSTRAINT "workspace_inspirations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_notes" ADD CONSTRAINT "workspace_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
