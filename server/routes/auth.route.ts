import { Router } from "express";
import { signup, login, logout, signout } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup",  signup);
router.post("/login",   login);
router.post("/logout",  logout);
router.delete("/signout", requireAuth, signout);

export default router;