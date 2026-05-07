// controllers/github.controller.ts

import { Request, Response } from "express";
import { getGithubProfile } from "../services/github.service";

/**
 * GET /api/github/:username
 * Returns normalised GitHub profile + contribution data.
 * Protected by requireAuth (applied at the router level).
 */
export async function githubProfile(req: Request, res: Response): Promise<void> {
  const { username } = req.params;

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    res.status(400).json({ message: "Username is required." });
    return;
  }

  // Basic sanitisation — GitHub usernames are alphanumeric + hyphens, max 39 chars
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username.trim())) {
    res.status(400).json({ message: "Invalid GitHub username format." });
    return;
  }

  try {
    const data = await getGithubProfile(username.trim());
    res.status(200).json(data);
  } catch (err: any) {
    const message: string = err?.message ?? "Failed to fetch GitHub data.";

    // Surface known user-facing errors with appropriate status codes
    if (message.includes("not found")) {
      res.status(404).json({ message });
      return;
    }
    if (message.includes("rate limit")) {
      res.status(429).json({ message });
      return;
    }

    console.error("[githubProfile]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}