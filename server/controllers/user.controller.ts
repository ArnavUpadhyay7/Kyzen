import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * PATCH /api/user/preferences
 */
export async function updatePreferences(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { devMode } = req.body as { devMode?: boolean };

  if (typeof devMode !== "boolean") {
    res.status(400).json({ message: "devMode must be a boolean." });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { devMode },
    });

    res.status(200).json({ devMode: user.devMode });
  } catch (err) {
    console.error("[updatePreferences]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}