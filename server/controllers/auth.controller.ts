import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/token";
import { AuthRequest } from "../middleware/auth.middleware";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ── Helpers ───────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Strip the password field before sending user data to the client. */
function safeUser(user: {
  id: string;
  email: string;
  password: string | null;
  provider: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  const { password: _password, ...rest } = user;
  return rest;
}

// ── Controllers ───────────────────────────────────────────────

/**
 * POST /api/auth/signup
 */
export async function signup(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email address." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters." });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "An account with that email already exists." });
      return;
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        provider: "local",
      },
    });

    const token = generateToken(user.id);
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({ user: safeUser(user) });
  } catch (err) {
    console.error("[signup]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    if (user.provider !== "local" || !user.password) {
      res.status(400).json({
        message: "This account uses a different sign-in method.",
      });
      return;
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const token = generateToken(user.id);
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({ user: safeUser(user) });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
}

/**
 * DELETE /api/auth/signout  (protected)
 * Permanently deletes the authenticated user and all their data.
 */
export async function signout(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("[signout]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}