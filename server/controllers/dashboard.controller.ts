import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { buildDashboardPayload } from "../utils/dashboard";

/* ─────────────────────────────────────────
   GET /dashboard
───────────────────────────────────────── */
export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const payload = await buildDashboardPayload(req.user!.id);

    if (!payload) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json(payload);
  } catch (err) {
    console.error("[getDashboard]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}
