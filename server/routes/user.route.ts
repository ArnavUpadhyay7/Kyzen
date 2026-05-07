import { Router } from "express";
import { updatePreferences } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.patch("/preferences", requireAuth, updatePreferences);

export default router;