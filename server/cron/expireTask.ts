/**
 * cron/expireTasks.ts
 *
 * Fires every day at midnight.
 * Marks all PENDING tasks whose expiresAt ≤ now as MISSED.
 *
 * Register once in app.ts:
 *   import "./cron/expireTasks";
 *
 * Requires: npm install node-cron && npm install -D @types/node-cron
 */

import cron from "node-cron";
import { TaskStatus } from "@prisma/client";
import prisma from "../lib/prisma";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const { count } = await prisma.task.updateMany({
      where: {
        status:    TaskStatus.PENDING,
        expiresAt: { lte: now },
      },
      data: { status: TaskStatus.MISSED },
    });

    console.log(`[cron] Expired ${count} task(s) at ${now.toISOString()}`);
  } catch (err) {
    console.error("[cron] Failed to expire tasks:", err);
  }
});