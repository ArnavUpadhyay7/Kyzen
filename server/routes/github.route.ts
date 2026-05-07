// routes/github.route.ts

import { Router } from "express";
import { githubProfile } from "../controllers/github.controller";

const router = Router();

/**
 * GET /api/github/:username
 * Proxies GitHub API requests through the backend.
 * requireAuth is applied in index.ts when mounting this router.
 */
router.get("/:username", githubProfile);

export default router;